import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as awsLogs from '@aws-cdk/aws-logs';
import * as ec2 from '@aws-cdk/aws-ec2';
import { LambdaConstructProps } from '../../models/lambda-construct-props';

export class LambdaConstruct extends cdk.Construct {
    private props: LambdaConstructProps;
    public lambdaFunction: lambda.Function;
    constructor(parent: cdk.Construct, id: string, props: LambdaConstructProps) {
        super(parent, id);
        this.props = props;
        const lambdaLogGroup = this.createLogGroup();
        const myVpc = ec2.Vpc.fromLookup(this, 'myVpc', {
            vpcId: props.vpcId,
        });

        this.lambdaFunction = new lambda.Function(this, props.functionName, {
            functionName: props.functionName,
            memorySize: props.memorySize ? props.memorySize : 512,
            runtime:
                props.type === LambdaConstructProps.LambdaTypeEnum.JAVA
                    ? lambda.Runtime.JAVA_11
                    : lambda.Runtime.NODEJS_12_X,
            handler: props.handler
                ? props.handler
                : props.type === LambdaConstructProps.LambdaTypeEnum.JAVA
                ? 'com.gsa.MyHandler::handleRequest'
                : 'index.handler',
            vpc: props.vpcId ? myVpc : undefined,
            code: lambda.Code.fromAsset(props.assetLocation),
            timeout: cdk.Duration.seconds(props.timeout ? props.timeout : 30),
            environment: props.lambdaEnvParameters ? props.lambdaEnvParameters : {},
        });

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
