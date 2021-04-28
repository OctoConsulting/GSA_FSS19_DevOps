import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as customResource from '@aws-cdk/custom-resources';
import * as rds from '@aws-cdk/aws-rds';
import * as s3 from '@aws-cdk/aws-s3';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { AllLambdasConstructParms } from '../models/all-lambdas-consruct-props';
import { LambdaConstruct } from './lambda-construct';
import { constants } from '../models/constants';
import { LambdaFunResponse } from '../models/lambda-fun-response';

export class AllLambdasConstruct extends cdk.Construct {
    private props: AllLambdasConstructParms;
    private lambdaFunResponse: LambdaFunResponse[] = [];
    private vpc: ec2.IVpc;
    private securityGroup: ec2.ISecurityGroup;
    private sharedArtifactVersion: string;
    private artifactBucket: s3.IBucket;

    constructor(parent: cdk.Construct, id: string, props: AllLambdasConstructParms) {
        super(parent, id);
        this.props = props;
        this.buildPreRequisites();
        this.buildSharedArtifactVersion();
        this.buildAllLambdas();
    }

    private buildAllLambdas() {
        this.props.lambdaFuns.forEach((lambdaFun) => {
            this.lambdaFunResponse.push({
                function: this.buildLambda(
                    lambdaFun.name,
                    lambdaFun.handler ? lambdaFun.handler : 'index.handler',
                    lambdaFun.artifactPath,
                    lambdaFun.writeAccessToDynamo ? lambdaFun.writeAccessToDynamo : false,
                    lambdaFun.writeAccessToS3 ? lambdaFun.writeAccessToS3 : false,
                    lambdaFun.rdsAccess ? lambdaFun.rdsAccess : false
                ),
                name: lambdaFun.name,
            });
        });
    }

    private buildPreRequisites() {
        this.vpc = ec2.Vpc.fromLookup(this, 'myVpc', {
            vpcId: this.props.vpc,
        });

        this.securityGroup = new ec2.SecurityGroup(this, 'sg', {
            securityGroupName: `${constants.API_PREFIX}-${this.props.shortEnv}`,
            vpc: this.vpc,
        });
        this.artifactBucket = s3.Bucket.fromBucketName(this, 'artifact-bucket', this.props.artifactBucket);
    }

    private buildSharedArtifactVersion() {
        if (!this.props.sharedArtifactPath) {
            return;
        }
        this.sharedArtifactVersion = this.getArtifactVersion(this.props.sharedArtifactPath, 'shared-artificat');
    }

    private getArtifactVersion(artifactPath: string, id: string) {
        const s3VersionResource = new customResource.AwsCustomResource(this, `${artifactPath}-version`, {
            onUpdate: {
                service: 'S3',
                action: 'listObjectVersions',
                parameters: {
                    Bucket: this.props.artifactBucket,
                    Prefix: artifactPath,
                    MaxKeys: 1,
                },
                physicalResourceId: customResource.PhysicalResourceId.of(Date.now().toString()),
            },
            policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
                resources: customResource.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
        this.artifactBucket.grantRead(s3VersionResource);
        return s3VersionResource.getResponseField('Versions.0.VersionId');
    }

    private buildLambda(
        name: string,
        handler: string,
        artifactPath?: string,
        writeAccessToDynamo = false,
        writeAccessToS3 = false,
        rdsAccess = false
    ) {
        /**
         * Locate Lambda Artifact
         */
        var artifactVersion = this.sharedArtifactVersion;
        var artifactKey = this.props.sharedArtifactPath;

        if (artifactPath) {
            artifactKey = artifactPath;
            artifactVersion = this.getArtifactVersion(artifactPath, name);
        }

        /**
         * Build Environment variables to be passed to Lambda
         */
        var envVariables: any = {
            SHORT_ENV: this.props.shortEnv,
        };

        if (this.props.dynamoTable) {
            envVariables = { ...envVariables, TABLE_NAME: this.props.dynamoTable.tableName };
        }

        if (rdsAccess) {
            const rdsEnvs = {
                DB_HOST: this.props.rdsDbProps?.rdsProxyDefaultEndpoint,
                DB_NAME: this.props.rdsDbProps?.dbName,
                DB_USER: this.props.rdsDbProps?.rdsProxyLambdaUser,
            };
            envVariables = { ...envVariables, ...rdsEnvs };
        }

        /**
         * Create Lambda Function
         */
        const lambdaFun = new LambdaConstruct(this, `${name}`, {
            functionName: `${name}-${this.props.shortEnv}`,
            vpc: this.vpc,
            securityGroup: this.securityGroup,
            artifactBucket: this.props.artifactBucket,
            artifactKey: artifactKey,
            artifactVersion: artifactVersion,
            lambdaEnvParameters: envVariables,
            handler: handler,
            type: LambdaConstructProps.LambdaTypeEnum.NODEJS,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });

        /**
         * Grant S3 Access
         */
        if (writeAccessToS3) this.props.s3Bucket!.grantWrite(lambdaFun.lambdaFunction);

        /**
         * Grant Dynamo Access
         */
        if (this.props.dynamoTable) {
            writeAccessToDynamo
                ? this.props.dynamoTable.grantReadWriteData(lambdaFun.lambdaFunction)
                : this.props.dynamoTable.grantReadData(lambdaFun.lambdaFunction);
        }

        /**
         * Grant RDS Access
         */
        if (rdsAccess) {
            if (!this.props.rdsDbProps) {
                throw new Error(
                    'Lambda Requires access to RDS instances, Hence rdsDbProps must be passed along with rdsAccess is true'
                );
            }
            const nsnRdsProxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(this, `rds-proxy-import-${name}`, {
                dbProxyArn: this.props.rdsDbProps.rdsProxyArn,
                dbProxyName: this.props.rdsDbProps.rdsProxyName,
                endpoint: this.props.rdsDbProps.rdsProxyDefaultEndpoint,
                securityGroups: cdk.Fn.split(',', this.props.rdsDbProps.rdsProxySgs).map((sg) =>
                    ec2.SecurityGroup.fromSecurityGroupId(this, sg, sg)
                ),
            });
            nsnRdsProxy.grantConnect(lambdaFun.lambdaFunction, this.props.rdsDbProps?.rdsProxyLambdaUser);
        }
        return lambdaFun.alias;
    }

    public getLambdaFunctions(): LambdaFunResponse[] {
        return this.lambdaFunResponse;
    }
}
