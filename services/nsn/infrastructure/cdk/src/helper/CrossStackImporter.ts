import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { CrossStackImports } from '../models/CrossStackImports';
import { EnvParameters } from '../models/env-parms';

export class CrossStackImporter extends cdk.Construct {
    private crossStackImports: CrossStackImports;

    constructor(parent: cdk.Construct, id: string, props: EnvParameters) {
        super(parent, id);
        this.crossStackImports = this.getCrossStackRefs(props);
    }

    private getCrossStackRefs(props: EnvParameters) {
        const apiGatewayVpcEndpoint = ec2.InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(
            this,
            'api-gateway-vpc-endpoint',
            {
                vpcEndpointId: cdk.Fn.importValue(`api-gateway-vpc-endpoint-id`),
                port: 443,
            }
        );

        const vpc = ec2.Vpc.fromLookup(this, 'myVpc', {
            vpcId: props.vpc,
        });

        return {
            apiGatewayVpcEndpoint,
            vpc,
        };
    }

    public getCrossStackImports() {
        return this.crossStackImports;
    }
}
