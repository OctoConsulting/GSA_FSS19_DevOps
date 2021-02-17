import * as cdk from '@aws-cdk/core';
import { EndpointsConstruct } from './constructs/endpoints-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';

export class FssSharedStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);

        new EndpointsConstruct(this, 'endpoints', {
            envParameters,
        });
    }
}
