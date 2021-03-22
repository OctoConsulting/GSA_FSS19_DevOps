import * as cdk from '@aws-cdk/core';
import { EnvHelper } from './helper/env-helper';
import { CrossStackImporter } from './helper/CrossStackImporter';
import { EnvParameters } from './models/env-parms';
import { StaticWebConstruct } from './constructs/static-web-construct';
export class FssUIStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);
        const crossStackImporter = new CrossStackImporter(this, 'corss-stack-imports', envParameters);

        new StaticWebConstruct(this, 'static-web', {
            domainSuffix: envParameters.domainSuffix!,
            shortEnv: envParameters.shortEnv,
        });
    }
}
