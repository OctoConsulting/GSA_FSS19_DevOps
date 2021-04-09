import * as cdk from '@aws-cdk/core';
import { ApiGatewayConstructParms } from '../models/api-gateway-construct-parms';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import { constants } from '../models/constants';

export class ApiGatewayConstruct extends cdk.Construct {
    private props: ApiGatewayConstructParms;
    private restApi: apigw.RestApi;
    private apiRole: iam.Role;
    constructor(parent: cdk.Construct, id: string, props: ApiGatewayConstructParms) {
        super(parent, id);
        this.props = props;
        this.createRestApi();
        this.createApiRole();
        this.addApiResourcesAndMethods();
        this.addRoute53Alias();
    }
    private addApiResourcesAndMethods() {
        const baseResource = this.restApi.root.addResource('nsnService').addResource('v1');
        this.addGetNsnServiceDetailsIntegration(baseResource);
    }

    private addGetNsnServiceDetailsIntegration(baseResource: apigw.Resource) {
        const resource = baseResource.addResource('details').addResource('{nsnid}');

        resource.addMethod(
            'GET',
            new apigw.LambdaIntegration(this.props.lambdaFunctions.getNsnServiceDetails, {
                credentialsRole: this.apiRole,
            })
        );
    }
    private createRestApi() {
        this.restApi = new apigw.RestApi(this, 'my-rest-api', {
            description: `${constants.API_PREFIX}-api-${this.props.envParameters.shortEnv}`,
            restApiName: `${constants.API_PREFIX}-${this.props.envParameters.shortEnv}`,
            cloudWatchRole: false,
            deployOptions: {
                stageName: `${this.props.envParameters.shortEnv}`,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            policy: this.getApiGatewayResourcePolicy(),
            endpointConfiguration: {
                types: [apigw.EndpointType.PRIVATE],
                vpcEndpoints: [this.props.iVpcEndpoint!],
            },
            domainName: this.props.envParameters.domainSuffix
                ? {
                      domainName: `${constants.API_PREFIX}-${this.props.envParameters.shortEnv}.${this.props.envParameters.domainSuffix}`,
                      certificate: acm.Certificate.fromCertificateArn(
                          this,
                          'my-cert',
                          this.props.envParameters.certArn!
                      ),
                      endpointType: apigw.EndpointType.REGIONAL,
                  }
                : undefined,
        });
    }

    private getApiGatewayResourcePolicy() {
        return new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    actions: ['execute-api:Invoke'],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                    principals: [new iam.AnyPrincipal()],
                    conditions: {
                        StringEquals: {
                            'aws:SourceVpce': this.props.iVpcEndpoint!.vpcEndpointId,
                        },
                    },
                }),
            ],
        });
    }

    private createApiRole() {
        this.apiRole = new iam.Role(this, 'api-role', {
            roleName: `${constants.API_PREFIX}-gateway-role-${this.props.envParameters.shortEnv}`,
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        });

        this.apiRole.addToPolicy(
            new iam.PolicyStatement({
                resources: [this.props.lambdaFunctions.getNsnServiceDetails.functionArn],
                actions: ['lambda:InvokeFunction'],
            })
        );
    }

    private addRoute53Alias() {
        if (!this.props.envParameters.domainSuffix) {
            return;
        }
        const hostedZone = route53.HostedZone.fromLookup(this, 'hosted-zone-lookup', {
            domainName: `${this.props.envParameters.domainSuffix}`,
        });
        new route53.ARecord(this, 'api-gateway-route53', {
            recordName: `${constants.API_PREFIX}-${this.props.envParameters.shortEnv}.${this.props.envParameters.domainSuffix}`,
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(this.restApi)),
        });
    }
}
