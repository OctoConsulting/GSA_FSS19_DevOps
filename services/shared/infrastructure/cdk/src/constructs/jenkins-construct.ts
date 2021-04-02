import { Bucket, BucketEncryption, IBucket} from '@aws-cdk/aws-s3';
import { CfnLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import {
  JenkinsConstructParms,
  CreateSecretsProps,
  CreateClusterProps
} from '../models/jenkins-construct-parms';
import {
  IFileSystem,
  FileSystem,
  IAccessPoint,
  LifecyclePolicy,
  PerformanceMode,
  ThroughputMode,
  CfnFileSystem
} from '@aws-cdk/aws-efs';
import {
  Port,
  SecurityGroup,
} from '@aws-cdk/aws-ec2';
import {
  Cluster,
  ContainerImage,
  LogDriver,
  Secret as EcsSecret,
  FargatePlatformVersion,
  TaskDefinition,
  Compatibility,
  NetworkMode,
  ContainerDefinition,
  AwsLogDriver,
  CfnService,
  CfnCluster
} from '@aws-cdk/aws-ecs';
import {
  ApplicationLoadBalancedFargateService
} from '@aws-cdk/aws-ecs-patterns';
import {
  Effect,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from '@aws-cdk/aws-iam';
import {
  LogGroup,
  RetentionDays
} from '@aws-cdk/aws-logs';
import {
  Secret
} from '@aws-cdk/aws-secretsmanager';
import {
  DnsRecordType
} from '@aws-cdk/aws-servicediscovery';
import {
  Construct,
  Duration
} from '@aws-cdk/core';
import {
  HostedZone,
} from '@aws-cdk/aws-route53';
import {
  CertificateValidation,
  Certificate
} from '@aws-cdk/aws-certificatemanager';
import { Key } from '@aws-cdk/aws-kms';

export class JenkinsConstruct extends Construct {
  private props: JenkinsConstructParms;
  private fileSystem: IFileSystem;
  private accessPoint: IAccessPoint;
  private artifactsBucket: IBucket;
  constructor(parent: Construct, id: string, props: JenkinsConstructParms) {
    super(parent, id);
    this.props = props;
    const vpc = props.vpc;
    const jenkinsDomainName = `jenkins.${props.stackContext.domainName}`;
    const cognitoServerUrl = `https://fss19-${props.envParameters.shortEnv}.auth.${props.envParameters.region}.amazoncognito.com`;
    const cognitoAdminGroup = props.stackContext.cognitoAdminGroup

    const subnets = this.props.ciCdSubnets;

    const leaderSecurityGroup = new SecurityGroup(this, "LeaderSecurityGroup", {
      vpc
    });
    const workerSecurityGroup = new SecurityGroup(this, "WorkerSecurityGroup", {
      vpc
    });

    leaderSecurityGroup.connections.allowFrom(workerSecurityGroup, Port.allTraffic());
    workerSecurityGroup.connections.allowFrom(leaderSecurityGroup, Port.allTraffic());

    this.fileSystem = this.createEfsFileSystem();

    const executionRole = this.createExecutionRole();
    const jenkinsLeaderTaskRole = this.createJenkinsLeaderTaskRole();
    const jenkinsWorkerTaskRole = this.createJenkinsWorkerTaskRole();
    const jenkinsAdminWorkerTaskRole = this.createJenkinsAdminWorkerTaskRole();
    const logGroup = new LogGroup(this, "JenkinsLogGroup", {
      retention: (<any>RetentionDays)[this.props.stackContext.jenkinsLogRetention],
    });

    const secrets = this.createSecrets({
      githubTokenSecretArn: props.stackContext.githubTokenSecretArn,
      cognitoUserPoolSecretArn: props.cognitoUserPoolSecretArn
    });

    const cluster = this.createCluster({
      vpc: vpc,
      defaultNamespace: `jenkins.${props.envParameters.shortEnv}`
    });
    
    // need the public zone to create public SSL certs
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.stackContext.domainName,
      privateZone: false
    });

    const privateHostedZone = HostedZone.fromLookup(this, 'PrivateHostedZone', {
      domainName: props.stackContext.domainName,
      privateZone: true,
    });

    this.artifactsBucket = this.createAritfactsS3Bucket();
    this.artifactsBucket.grantReadWrite(jenkinsWorkerTaskRole);

    const fargateService = new ApplicationLoadBalancedFargateService(
      this,
      "JenkinsService", {
        listenerPort: 443,
        domainZone: privateHostedZone,
        domainName: jenkinsDomainName,
        certificate: new Certificate(this, 'Certificate', {
          domainName: jenkinsDomainName,
          validation: CertificateValidation.fromDns(hostedZone),
        }),
        cluster,
        taskSubnets: vpc.selectSubnets({
          subnets: this.props.ciCdSubnets
        }),
        platformVersion: FargatePlatformVersion.VERSION1_4,
        cpu: 2048,
        memoryLimitMiB: 4096,
        desiredCount: 1,
        securityGroups: [leaderSecurityGroup],
        assignPublicIp: false,
        taskImageOptions: {
          image: ContainerImage.fromAsset('src/jenkins/docker/jenkinsLeader'),
          containerPort: 8080,
          executionRole,
          taskRole: jenkinsLeaderTaskRole,
          logDriver: LogDriver.awsLogs({
            logGroup,
            streamPrefix: 'jenkins-leader',
          }),
          environment: {
            GITHUB_REPO_OWNER: props.stackContext.githubRepoOwner,
            GITHUB_REPO: props.stackContext.githubRepo,
            JENKINS_ADMIN_ACCOUNT: 'admin',
            JENKINS_DOMAIN_NAME: jenkinsDomainName,
            COGNITO_SERVER_URL: cognitoServerUrl,
            JENKINS_LINUX_WORKER_ECS_CLUSTER_ARN: cluster.clusterArn,
            JENKINS_LINUX_WORKER_SECURITY_GROUPS: workerSecurityGroup.securityGroupId,
            JENKINS_LINUX_WORKER_USE_PUBLIC_SUBNETS: "false",
            JENKINS_LINUX_WORKER_SUBNETS: subnets.map(s => s.subnetId).join(','),
            JENKINS_LINUX_WORKER_TASK_ROLE: jenkinsWorkerTaskRole.roleArn,
            JENKINS_LINUX_ADMIN_WORKER_TASK_ROLE: jenkinsAdminWorkerTaskRole.roleArn,
            JENKINS_LINUX_WORKER_EXECUTION_ROLE: executionRole.roleArn,
            JENKINS_LINUX_WORKER_LOGS_GROUP: logGroup.logGroupName,
            COGNITO_ADMIN_GROUP: cognitoAdminGroup,
            SHORT_ENV: props.envParameters.shortEnv,
            AWS_REGION: this.props.envParameters.region!,
            AWS_ACCOUNT: this.props.envParameters.account!,
            ARTIFACTS_BUCKET: this.artifactsBucket.bucketName
          },
          secrets,
        },
        publicLoadBalancer: false,
        cloudMapOptions: {
          name: 'leader',
          dnsRecordType: DnsRecordType.A
        },
    });
    // Allow support for ECS exec troubleshooting feature
    const execKmsKey = new Key(this, "ExecKmsKey");
    const execLogGroup = new LogGroup(this, "ExecLogGroup");
    const execBucket = new Bucket(this, "ExecBucket");
    execKmsKey.grantDecrypt(jenkinsLeaderTaskRole);
    execLogGroup.grantWrite(jenkinsLeaderTaskRole);
    execBucket.grantPut(jenkinsLeaderTaskRole);

    const CfnCluster = cluster.node.defaultChild as CfnCluster;
    CfnCluster.addPropertyOverride('Configuration.executeCommandConfiguration', {
      KmsKeyId: execKmsKey.keyId,
      LogConfiguration: {
        CloudWatchLogGroupName: execLogGroup.logGroupName,
        S3BucketName: execBucket.bucketName,
        S3KeyPrefix: 'exec-output'
      },
      Logging: 'OVERRIDE'
    });
    const CfnService = fargateService.service.node.findChild('Service') as CfnService;
    CfnService.addPropertyOverride('EnableExecuteCommand', true);

    // TODO: Make communication between jenkins leader and workers SSL (via ALB)
    // need to use ApplicationMultipleTargetGroupsServiceBaseProps or escape hatches
    // steps are to add a target group to point at container exposed service 50000 (HTTP)
    // and also add a listener on HTTPS 50000
    // and lastly change jenkins config to point at the ssl endpoint in ecs cloud config
    const cfnLoadBalancer = fargateService.loadBalancer.node.defaultChild as CfnLoadBalancer;
    cfnLoadBalancer.subnets = vpc.selectSubnets({ subnets: this.props.ciCdSubnets }).subnetIds

    fargateService.targetGroup.configureHealthCheck({
      path: '/login',
      timeout: Duration.seconds(5),
      unhealthyThresholdCount: 10,
      interval: Duration.seconds(10)
    });
    fargateService.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30');

    fargateService.service.taskDefinition.addVolume({
      name: 'efs',
      efsVolumeConfiguration: {
        fileSystemId: this.fileSystem.fileSystemId,
        transitEncryption: 'ENABLED',
        authorizationConfig: {
          accessPointId: this.accessPoint.accessPointId
        }
      }
    });

    fargateService.service.taskDefinition.defaultContainer?.addPortMappings({
      containerPort: 50000,
      hostPort: 50000,
    });

    fargateService.service.taskDefinition.defaultContainer?.addMountPoints({
      containerPath: '/var/jenkins_home',
      readOnly: false,
      sourceVolume: 'efs'
    });

    fargateService.service.connections.allowFrom(this.fileSystem, Port.tcp(2049));
    fargateService.service.connections.allowTo(this.fileSystem, Port.tcp(2049));

    // Static task definition to be used by jenkins ecs admin workers
    const jenkinsAdminWorkerTaskDef = new TaskDefinition(this, "JenkinsAdminWorkerTaskDef", {
      compatibility: Compatibility.FARGATE,
      cpu: '2048',
      memoryMiB: '4096',
      executionRole: executionRole,
      taskRole: jenkinsAdminWorkerTaskRole,
      family: 'ecsJenkinsStaticLinuxAdminWorker',
      networkMode: NetworkMode.AWS_VPC,
    });
    new ContainerDefinition(this, "JenkinsAdminWorkerContainerDef", {
      image: ContainerImage.fromRegistry('jenkins/inbound-agent'),
      taskDefinition: jenkinsAdminWorkerTaskDef,
      logging: new AwsLogDriver({
        streamPrefix: 'jenkins-admin-worker'
      })
    });


    // Static task definition to be used by jenkins ecs workers
    const jenkinsWorkerTaskDef = new TaskDefinition(this, "JenkinsWorkerTaskDef", {
      compatibility: Compatibility.FARGATE,
      cpu: '2048',
      memoryMiB: '4096',
      executionRole: executionRole,
      taskRole: jenkinsWorkerTaskRole,
      family: 'ecsJenkinsStaticLinuxWorker',
      networkMode: NetworkMode.AWS_VPC,
    });
    new ContainerDefinition(this, "JenkinsWorkerContainerDef", {
      image: ContainerImage.fromRegistry('jenkins/inbound-agent'),
      taskDefinition: jenkinsWorkerTaskDef,
      logging: new AwsLogDriver({
        streamPrefix: 'jenkins-worker'
      })
    });
  }

  private createSecrets({
    githubTokenSecretArn,
    cognitoUserPoolSecretArn
  }: CreateSecretsProps) {
    const jenkinsAdminPassword = new Secret(this, "jenkinsSecret", {
      secretName: "JenkinsAdminSecret",
      description: "Jenkins Admin Password"
    });
    const githubSecret = Secret.fromSecretCompleteArn(
      this,
      "GithubToken",
      githubTokenSecretArn,
    );
    const cognitoSecret = Secret.fromSecretCompleteArn(
      this,
      "CognitoSecret",
      cognitoUserPoolSecretArn
    );
    return {
      GITHUB_USERNAME: EcsSecret.fromSecretsManager(githubSecret, 'github_username'), 
      GITHUB_TOKEN: EcsSecret.fromSecretsManager(githubSecret, 'github_token'),
      JENKINS_ADMIN_PASSWORD: EcsSecret.fromSecretsManager(jenkinsAdminPassword),
      COGNITO_CLIENT_ID: EcsSecret.fromSecretsManager(cognitoSecret, 'userPoolClientId'),
      COGNITO_CLIENT_SECRET: EcsSecret.fromSecretsManager(cognitoSecret, 'userPoolClientSecret'),
    };
  }

  private createJenkinsWorkerTaskRole(): Role {
    const workerRole = new Role(this, "JenkinsWorkerTaskRole", {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    // TODO: This need to be replaced with Lambda execute access 
    // for each lambda separately for more granular security.
    workerRole.addManagedPolicy(
      new ManagedPolicy(this, "JenkinsWorkerPolicy", {
        managedPolicyName: "JenkinsWorkerPolicy",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              "lambda:UpdateFunctionCode",
              "lambda:PublishVersion",
              "lambda:UpdateAlias"
            ],
            resources: ['*']
          })
        ]
      }
    ));
    return workerRole;
  }
  private createJenkinsAdminWorkerTaskRole(): Role {
    const adminWorkerRole = new Role(this, "JenkinsAdminWorkerTaskRole", {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    // this should only be limited to what needs to be deploy by cdk
    adminWorkerRole.addManagedPolicy(
      new ManagedPolicy(this, "JenkinsAdminWorkerPolicy", {
        managedPolicyName: "JenkinsAdminWorkerPolicy",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              "*"
            ],
            resources: ['*']
          })
        ]
      }
    ));
    return adminWorkerRole;
  }

  private createJenkinsLeaderTaskRole(): Role {
    const taskRole = new Role(this, "JenkinsLeaderTaskRole", {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addManagedPolicy(
      new ManagedPolicy(this, "CreateEC2WorkerPolicy", {
        managedPolicyName: "CreateEC2WorkerPolicy",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              'ec2:DescribeSpotInstanceRequests',
              'ec2:CancelSpotInstanceRequests',
              'ec2:GetConsoleOutput',
              'ec2:RequestSpotInstances',
              'ec2:RunInstances',
              'ec2:StartInstances',
              'ec2:StopInstances',
              'ec2:TerminateInstances',
              'ec2:CreateTags',
              'ec2:DeleteTags',
              'ec2:DescribeInstances',
              'ec2:DescribeKeyPairs',
              'ec2:DescribeRegions',
              'ec2:DescribeImages',
              'ec2:DescribeAvailabilityZones',
              'ec2:DescribeSecurityGroups',
              'ec2:DescribeSubnets',
              'ec2:GetPasswordData',
              'iam:ListInstanceProfilesForRole',
              'iam:PassRole'
            ],
            resources: ['*'],
          }),
        ],
      }),
    );

    // TODO: Make policy stricter
    taskRole.addManagedPolicy(
      new ManagedPolicy(this, "CreateECSWorkerPolicy", {
        managedPolicyName: "CreateECSWorkerPolicy",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              'ecs:RegisterTaskDefinition',
              'ecs:ListClusters',
              'ecs:DescribeContainerInstances',
              'ecs:ListTaskDefinitions',
              'ecs:DescribeTaskDefinition',
              'ecs:DeregisterTaskDefinition',
              'ecs:ListContainerInstances',
              'ecs:RunTask',
              'ecs:StopTask',
              'ecs:DescribeTasks',
              "ssmmessages:CreateControlChannel",
              "ssmmessages:CreateDataChannel",
              "ssmmessages:OpenControlChannel",
              "ssmmessages:OpenDataChannel"
            ],
            resources: ['*'],
          }),
        ],
      }),
    );

    return taskRole;
  }

  private createExecutionRole(): Role {
    const executionRole = new Role(this, "ExecutionRole", {
      roleName: "ExecutionRole",
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    executionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );

    return executionRole;
  }

  private createCluster({
    vpc,
    defaultNamespace
  }: CreateClusterProps) {
    return new Cluster(this, "Cluster", {
      vpc,
      defaultCloudMapNamespace: {
        name: defaultNamespace,
      }
    });
  }

  private createEfsFileSystem(): IFileSystem {
    const fileSystem = new FileSystem(this, "persistentFileSystem", {
      vpc: this.props.vpc,
      encrypted: true,
      lifecyclePolicy: LifecyclePolicy.AFTER_14_DAYS,
      performanceMode: PerformanceMode.GENERAL_PURPOSE,
      throughputMode: ThroughputMode.BURSTING,
      vpcSubnets: this.props.vpc.selectSubnets({
        subnets: this.props.ciCdSubnets
      })
    });

    // Create a custom KMS key to encrypt the EFS Volume
    const kmsKey = new Key(this, 'EfsKmsKey');
    const cfnFileSystem = fileSystem.node.defaultChild as CfnFileSystem;
    cfnFileSystem.kmsKeyId = kmsKey.keyId;

    this.accessPoint = fileSystem.addAccessPoint("efsAccessPoint", {
      path: '/data',
      createAcl: {
        ownerGid: '1000',
        ownerUid: '1000',
        permissions: '0755'
      },
      posixUser: {
        uid: '1000',
        gid: '1000'
      }
    });
    return fileSystem;
  }
  private createAritfactsS3Bucket() {
    const kmsKey = new Key(this, 'ArtifactsBucketKmsKey', {
      enableKeyRotation: true
    });
    return new Bucket(this, "ArtifactsBucket", {
      bucketName: `artifacts-${this.props.envParameters.account}-${this.props.envParameters.region}-${this.props.envParameters.shortEnv}`,
      encryption: BucketEncryption.KMS,
      encryptionKey: kmsKey,
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(30),
      }]
    });
  }
}