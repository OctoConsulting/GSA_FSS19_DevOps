import * as cdk from '@aws-cdk/core';
import { ContractApiGatewayConstruct } from './constructs/contract-api-gateway-construct';
import { ContractDynamoConstruct } from './constructs/contract-dynamo-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';

export class ContractApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);

        new ContractDynamoConstruct(this, 'contract-dynamo', {
            envParameters,
        });

        new ContractApiGatewayConstruct(this, 'contract-api', {
            envParameters,
        });
    }
}
