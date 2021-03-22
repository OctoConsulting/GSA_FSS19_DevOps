import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { EndpointsConstructParms } from '../models/endpoints-construct-parms';
import { Endpoints } from '../models/endpoints';

export class EndpointsConstruct extends cdk.Construct {
    private props: EndpointsConstructParms;
    public endpoints: Endpoints = {};
    constructor(parent: cdk.Construct, id: string, props: EndpointsConstructParms) {
        super(parent, id);
        this.props = props;
        /**
         * Add Gateway Endpoint
         */
        this.setDynamoDbEndpoint();
        this.setApiGatewayEndpoint();
    }

    private setDynamoDbEndpoint() {
        this.props.vpc.addGatewayEndpoint('dynamo-db', {
            service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
            subnets: [
                {
                    subnets: this.props.isolatedSubnets
                },
            ],
        });
    }

    private setApiGatewayEndpoint() {
        const apiGatewayEndPoint: ec2.InterfaceVpcEndpoint = this.props.vpc.addInterfaceEndpoint('api-gateway-endpoint', {
            privateDnsEnabled: true,
            service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
            subnets: {
                subnets: this.props.isolatedSubnets
            },
        });
        this.endpoints.apiGatewayEndPoint = apiGatewayEndPoint;
        new cdk.CfnOutput(this, "api-gateway-endpoint-cfnout", {
            exportName: "api-gateway-vpc-endpoint-id",
            value: apiGatewayEndPoint.vpcEndpointId,
        });
    }
}
