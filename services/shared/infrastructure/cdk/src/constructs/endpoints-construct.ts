import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import { EndpointsConstructParms } from '../models/endpoints-construct-parms';
import { Endpoints } from '../models/endpoints';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';

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
                    subnets: this.props.isolatedSubnets,
                },
            ],
        });
    }

    private setApiGatewayEndpoint() {
        const apiGatewayEndPoint: ec2.InterfaceVpcEndpoint = this.props.vpc.addInterfaceEndpoint(
            'api-gateway-endpoint',
            {
                privateDnsEnabled: true,
                service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
                subnets: {
                    subnets: this.props.isolatedSubnets,
                },
            }
        );
        this.endpoints.apiGatewayEndPoint = apiGatewayEndPoint;

        const privateHostedZone = route53.HostedZone.fromLookup(this, 'hosted-zone-lookup', {
            domainName: `${this.props.domainName}`,
            privateZone: true,
        });

        const publicHostedZone = route53.HostedZone.fromLookup(this, 'public-hosted-zone-lookup', {
            domainName: `${this.props.domainName}`,
            privateZone: false,
        });

        const domainName = `execute-api.${this.props.domainName}`;
        const certificate = new acm.Certificate(this, 'certificate', {
            domainName: domainName,
            validation: acm.CertificateValidation.fromDns(publicHostedZone),
        });

        new route53.ARecord(this, 'cloudfront-route53', {
            recordName: domainName,
            zone: privateHostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.InterfaceVpcEndpointTarget(apiGatewayEndPoint)),
        });

        new cdk.CfnOutput(this, 'api-gateway-endpoint-cfnout', {
            exportName: 'api-gateway-vpc-endpoint-id',
            value: apiGatewayEndPoint.vpcEndpointId,
        });
    }
}
