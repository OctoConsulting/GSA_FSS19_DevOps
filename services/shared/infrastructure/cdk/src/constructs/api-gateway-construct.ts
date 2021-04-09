import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { CfnAccount } from '@aws-cdk/aws-apigateway';
import { ApiGatewayConstructProps } from '../models/misc/api-gateway-constrcut-props';

export class ApiGatewayConstruct extends cdk.Construct {
    private props: ApiGatewayConstructProps;
    constructor(parent: cdk.Construct, id: string, props: ApiGatewayConstructProps) {
        super(parent, id);
        this.props = props;

        this.apiGatewayLogging();
    }

    apiGatewayLogging() {
        const role = new iam.Role(this, 'CloudWatchRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs'),
            ],
        });
        new CfnAccount(this, 'Account', {
            cloudWatchRoleArn: role.roleArn,
        });
    }
}
