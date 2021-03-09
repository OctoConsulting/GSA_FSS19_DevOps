import * as cdk from '@aws-cdk/core';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';
import { PolicyConstruct } from './constructs/policy-construct';
import * as kms from '@aws-cdk/aws-kms';
export class FssIamStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        envParameters.iamSets.forEach((iamSet) => {
            new PolicyConstruct(this, `${iamSet.groupName}`, {
                iamSet,
                shortEnv: envParameters.shortEnv,
            });
        });
    }
}
