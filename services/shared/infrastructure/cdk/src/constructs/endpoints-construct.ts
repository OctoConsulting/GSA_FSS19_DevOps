import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { EndpointsConstructParms } from '../models/endpoints-construct-parms';
import { Endpoints } from '../models/endpoints';

export class EndpointsConstruct extends cdk.Construct {
    private props: EndpointsConstructParms;
    private myVpc: ec2.IVpc;
    public endpoints: Endpoints = {};
    constructor(parent: cdk.Construct, id: string, props: EndpointsConstructParms) {
        super(parent, id);
        this.props = props;
        this.myVpc = ec2.Vpc.fromLookup(this, 'vpc-lookup', {
            vpcId: this.props.envParameters.vpc,
        });

        /**
         * Add Gateway Endpoint
         */
        this.setDynamoDbEndpoint();
        this.setApiGatewayEndpoint();
    }

    private setDynamoDbEndpoint() {
        this.myVpc.addGatewayEndpoint('dynamo-db', {
            service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
            subnets: [
                {
                    subnetType: ec2.SubnetType.ISOLATED,
                },
            ],
        });
    }

    private setApiGatewayEndpoint() {
        const apiGatewayEndPoint: ec2.InterfaceVpcEndpoint = this.myVpc.addInterfaceEndpoint('api-gateway-endpoint', {
            privateDnsEnabled: true,
            service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
            subnets: {
                subnetType: ec2.SubnetType.ISOLATED,
            },
        });
        this.endpoints.apiGatewayEndPoint = apiGatewayEndPoint;
        new cdk.CfnOutput(this, `api-gateway-endpoint-cfnout`, {
            exportName: `api-gateway-vpc-endpoint-id`,
            value: apiGatewayEndPoint.vpcEndpointId,
        });
    }
}
