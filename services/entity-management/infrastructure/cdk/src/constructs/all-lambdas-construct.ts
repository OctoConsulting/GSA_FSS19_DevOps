import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as customResource from '@aws-cdk/custom-resources';
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
                    lambdaFun.artifactPath
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

    private buildLambda(name: string, handler: string, artifactPath: string, writeAccessToDynamo = false) {
        var artifactVersion = this.sharedArtifactVersion;
        var artifactKey = this.props.sharedArtifactPath;

        if (artifactPath) {
            artifactKey = artifactPath;
            artifactVersion = this.getArtifactVersion(artifactPath, name);
        }

        const lambdaFun = new LambdaConstruct(this, `${name}`, {
            functionName: `${name}-${this.props.shortEnv}`,
            vpc: this.vpc,
            securityGroup: this.securityGroup,
            artifactBucket: this.props.artifactBucket,
            artifactKey: artifactKey,
            artifactVersion: artifactVersion,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                LOG_LEVEL: this.props.logLevel,
                TABLE_NAME: this.props.dynamoTable.tableName,
            },
            handler: handler,
            type: LambdaConstructProps.LambdaTypeEnum.NODEJS,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });

        writeAccessToDynamo
            ? this.props.dynamoTable.grantReadWriteData(lambdaFun.lambdaFunction)
            : this.props.dynamoTable.grantReadData(lambdaFun.lambdaFunction);
        return lambdaFun.alias;
    }

    public getLambdaFunctions(): LambdaFunResponse[] {
        return this.lambdaFunResponse;
    }
}
