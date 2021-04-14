import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import { AuroraMysqlParms } from '../models/aurora-mysql-construct-parms';
import * as iam from '@aws-cdk/aws-iam';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { CfnInstance } from '@aws-cdk/aws-ec2';
import { ScopedAws } from '@aws-cdk/core';

export class AuroraMysqlConstruct extends cdk.Construct {
    private props: AuroraMysqlParms;
    proxy: rds.DatabaseProxy;
    readOnlyEndpoint: rds.CfnDBProxyEndpoint;

    constructor(parent: cdk.Construct, id: string, props: AuroraMysqlParms) {
        super(parent, id);
        this.props = props;
        this.createCluster();
        this.generateCfnOutputs();
    }

    private createCluster() {
        const params = this.props.stackContext.auroraMysql;
        const key = new kms.Key(this, 'AuroraKmsKey', {
            enableKeyRotation: true,
        });

        const masterSecret = createSecret(this, 'Master', 'admin');
        const readonlySecret = createSecret(this, 'ReadOnly', 'readonly');
        const lambdaSecret = createSecret(this, 'Lambda', 'lambda');

        const cluster = new rds.DatabaseCluster(this, 'Database', {
            credentials: rds.Credentials.fromSecret(masterSecret),
            engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
            storageEncrypted: true,
            storageEncryptionKey: key,
            instanceProps: {
                // optional , defaults to t3.medium
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
                vpcSubnets: this.props.vpc.selectSubnets({
                    subnetGroupName: 'IsolatedNsnAurora',
                }),
                vpc: this.props.vpc,
            },
            instances: params.instanceCount,
            backup: {
                retention: cdk.Duration.days(params.backupRetentionDays),
            },
        });
        const proxySecrets = [cluster.secret!, readonlySecret, lambdaSecret];
        // Use for performance enhacement through connection pooling
        // as well as better scaling and security management
        this.proxy = new rds.DatabaseProxy(this, 'Proxy', {
            proxyTarget: rds.ProxyTarget.fromCluster(cluster),
            secrets: proxySecrets,
            vpc: this.props.vpc,
            iamAuth: true,
            requireTLS: true,
            vpcSubnets: this.props.vpc.selectSubnets({
                subnetGroupName: 'IsolatedNsnAurora',
            }),
            dbProxyName: `fss-nsn-${this.props.shortEnv}`,
        });

        // The default endpoint is read/write, we will also create a
        // Readonly endpoint for the rds proxy
        this.readOnlyEndpoint = new rds.CfnDBProxyEndpoint(this, 'ReadOnlyProxyEndpoint', {
            dbProxyName: this.proxy.dbProxyName,
            dbProxyEndpointName: 'readonly',
            vpcSubnetIds: this.props.vpc.selectSubnets({
                subnetGroupName: 'IsolatedNsnAurora',
            }).subnetIds,
            targetRole: 'READ_ONLY',
            vpcSecurityGroupIds: this.proxy.connections.securityGroups.map((s) => s.securityGroupId),
        });

        // for the meantime allowing all vpc connections
        const ranges: string[] = params.allowFrom;
        ranges.push(this.props.vpc.vpcCidrBlock);
        for (let range of ranges) {
            this.proxy.connections.allowFrom(ec2.Peer.ipv4(range), ec2.Port.tcp(3306));
        }
        for (let grp of params.adminGroups) {
            let adminGroup = iam.Group.fromGroupArn(
                this,
                `${grp}-Import`,
                `arn:aws:iam::${this.props.account}:group/${grp}`
            );
            this.proxy.grantConnect(adminGroup, 'admin');
        }

        for (let grp of params.readOnlyGroups) {
            let readOnlyGroup = iam.Group.fromGroupArn(
                this,
                `${grp}-Import`,
                `arn:aws:iam::${this.props.account}:group/${grp}`
            );
            this.proxy.grantConnect(readOnlyGroup, 'readonly');
        }
    }

    private generateCfnOutputs() {
        const cfnExports = [
            { name: 'rds-proxy-default-endpoint', value: this.proxy.endpoint },
            { name: 'rds-proxy-readonly-endpoint', value: this.readOnlyEndpoint.attrEndpoint },
            { name: 'rds-proxy-name', value: this.proxy.dbProxyName },
            { name: 'rds-proxy-arn', value: this.proxy.dbProxyArn },
            {
                name: 'rds-proxy-sgs',
                value: this.proxy.connections.securityGroups.map((s) => s.securityGroupId).join(','),
            },
        ];
        for (let e of cfnExports) createExport(this, e.name, e.value);
    }
}

function createExport(scope: cdk.Construct, name: string, val: string) {
    return new cdk.CfnOutput(scope, name, {
        value: val,
        exportName: name,
    });
}

function createSecret(scope: cdk.Construct, name: string, user: string) {
    const secretKey = new kms.Key(scope, `${name}SecretKmsKey`, {
        enableKeyRotation: true,
    });
    return new Secret(scope, `AuroraCluster${name}Secret`, {
        encryptionKey: secretKey,
        generateSecretString: {
            excludePunctuation: true,
            secretStringTemplate: JSON.stringify({
                username: user,
            }),
            generateStringKey: 'password',
        },
    });
}
