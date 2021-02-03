import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstruct } from './constructs/contract-dynamo-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';

export class ContractApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`contact-api-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);

        new ContractDynamoConstruct(this, 'contract-dynamo', {
            envParameters,
        });
    }
}
