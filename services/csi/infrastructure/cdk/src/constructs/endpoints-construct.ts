import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { EndpointsConstructParms } from '../models/contract/endpoints-construct-parms';

/**
 * TODO: Should be moved to a shared cdk project
 */
export class EndpointsConstruct extends cdk.Construct {
    private props: EndpointsConstructParms;
    constructor(parent: cdk.Construct, id: string, props: EndpointsConstructParms) {
        super(parent, id);
        this.props = props;
        /**
         * Add Gateway Endpoint
         */
        this.setEndpoints();
    }

    setEndpoints() {
        const myVpc = ec2.Vpc.fromLookup(this, 'dynamo-db-end-point-vpc-lookup', {
            vpcId: this.props.envParameters.vpc,
        });

        myVpc.addGatewayEndpoint('contract-db-end-point', {
            service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
        });
    }
}
