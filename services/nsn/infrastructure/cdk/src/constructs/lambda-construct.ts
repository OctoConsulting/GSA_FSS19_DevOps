import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as awsLogs from '@aws-cdk/aws-logs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { constants } from '../models/constants';

export class LambdaConstruct extends cdk.Construct {
    private props: LambdaConstructProps;
    public lambdaFunction: lambda.Function;
    public alias: lambda.Alias;
    constructor(parent: cdk.Construct, id: string, props: LambdaConstructProps) {
        super(parent, id);
        this.props = props;
        const lambdaLogGroup = this.createLogGroup();

        var bucket: s3.IBucket;
        if (this.props.artifactBucket) {
            bucket = s3.Bucket.fromBucketName(this, 'bucket', this.props.artifactBucket);
        }

        this.lambdaFunction = new lambda.Function(this, props.functionName, {
            functionName: props.functionName,
            description: `${props.functionName}`,
            memorySize: props.memorySize ? props.memorySize : 512,
            runtime:
                props.type === LambdaConstructProps.LambdaTypeEnum.JAVA
                    ? lambda.Runtime.JAVA_8
                    : lambda.Runtime.NODEJS_12_X,
            handler: props.handler
                ? props.handler
                : props.type === LambdaConstructProps.LambdaTypeEnum.JAVA
                ? 'com.gsa.MyHandler::handleRequest'
                : 'index.handler',
            vpc: this.props.vpc,
            securityGroups: [this.props.securityGroup],
            vpcSubnets: {
                subnetType: ec2.SubnetType.ISOLATED,
            },
            tracing: this.props.xRayTracing ? lambda.Tracing.ACTIVE : lambda.Tracing.DISABLED,
            code: props.assetLocation
                ? lambda.Code.fromAsset(props.assetLocation)
                : lambda.Code.fromBucket(bucket!, this.props.artifactKey!, this.props.artifactVersion),
            timeout: cdk.Duration.seconds(props.timeout ? props.timeout : 30),
            environment: props.lambdaEnvParameters ? props.lambdaEnvParameters : {},
        });

        this.alias = new lambda.Alias(this, 'alias', {
            aliasName: constants.LIVE_ALIAS_NAME,
            version: this.lambdaFunction.currentVersion,
        });
        if (this.props.minCapacity) {
            this.alias.addAutoScaling({
                minCapacity: this.props.minCapacity,
                maxCapacity: constants.MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
            });
        }

        lambdaLogGroup.grantWrite(this.lambdaFunction);

        if (props.exportResource) {
            new cdk.CfnOutput(this, `${props.functionName}-cfnout`, {
                exportName: `${props.functionName}-Arn`,
                value: this.lambdaFunction.functionArn,
            });
        }
    }

    createLogGroup() {
        const lambdaLogGroup = new awsLogs.LogGroup(this, `LambdaLogGroup${this.props.functionName}`, {
            retention: this.props.logRetentionInDays ? this.props.logRetentionInDays : 30,
            logGroupName: `/aws/lambda/${this.props.functionName}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        return lambdaLogGroup;
    }
}
