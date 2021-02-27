import { IVpc, Vpc} from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { EndpointsConstruct } from './constructs/endpoints-construct';
import { VpcConstruct } from './constructs/vpc-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';
import { existsSync } from 'fs';

export class FssSharedStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);

        // ===== make sure cdk.context.json is populated first ======
        const myVpc:IVpc = Vpc.fromLookup(this, 'vpc-setup-lookup', {
            vpcId: envParameters.vpcId
        });
        if (!existsSync('cdk.context.json'))
            return;
        // ==========================================================

        const vpc = new VpcConstruct(this, 'vpc', {
            envParameters: envParameters,
            availabilityZones: this.availabilityZones,
            vpc: myVpc
        });

        new EndpointsConstruct(this, 'endpoints', {
            envParameters: envParameters,
            vpc: myVpc,
            isolatedSubnets: vpc.getIsolatedSubnets()
        });
    }
}
