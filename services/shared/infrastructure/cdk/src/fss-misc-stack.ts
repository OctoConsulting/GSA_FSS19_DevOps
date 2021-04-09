import * as cdk from '@aws-cdk/core';
import { ApiGatewayConstruct } from './constructs/api-gateway-construct';

export class FssMiscStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new ApiGatewayConstruct(this, 'apiGateway', {
            shortEnv: process.env.SHORT_ENV!,
        });
    }
}
