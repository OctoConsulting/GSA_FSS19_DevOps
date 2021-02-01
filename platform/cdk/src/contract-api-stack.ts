import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstruct } from './constructs/contract-dynamo-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';

export class ContractApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams();

        new ContractDynamoConstruct(this, 'contract-dynamo', {
            envParameters,
        });
    }
}
