import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import { EndpointsConstructParms } from '../models/endpoints-construct-parms';
import { Endpoints } from '../models/endpoints';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CfnResolverEndpoint, CfnResolverRule, CfnResolverRuleAssociation } from '@aws-cdk/aws-route53resolver';

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
        this.setRoute53ResolverEndpoint();
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
    private setRoute53ResolverEndpoint() {
        const route53ResolverEndpoint = new CfnResolverEndpoint(this, 'route53-resolver-endpoint', {
            direction: 'OUTBOUND',
            ipAddresses: this.props.route53IsolatedResolverSubnets.map((s) => {
                return {
                    subnetId: s.subnetId,
                };
            }),
            securityGroupIds: [
                new ec2.SecurityGroup(this, 'route53-resolver-sg', {
                    // change to limit to outbound 53 tcp/udp later
                    allowAllOutbound: true,
                    vpc: this.props.vpc,
                }).securityGroupId,
            ],
        });

        const route53Rule = new CfnResolverRule(this, 'route53-resolver-outbound', {
            domainName: 'gsa.gov',
            resolverEndpointId: route53ResolverEndpoint.attrResolverEndpointId,
            ruleType: 'FORWARD',
            targetIps: [{ ip: '159.142.136.220' }, { ip: '159.142.69.100' }],
        });

        new CfnResolverRuleAssociation(this, 'gsa-gov-rule-association', {
            vpcId: this.props.vpc.vpcId,
            resolverRuleId: route53Rule.attrResolverRuleId,
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
