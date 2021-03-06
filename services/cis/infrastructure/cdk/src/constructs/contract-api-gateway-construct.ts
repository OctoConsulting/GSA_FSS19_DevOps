import * as cdk from '@aws-cdk/core';
import { ContractApiGatewayConstructParms } from '../models/contract/contract-api-gateway-construct-parms';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { constants } from '../models/constants';

export class ContractApiGatewayConstruct extends cdk.Construct {
    private props: ContractApiGatewayConstructParms;
    private restApi: apigw.RestApi;
    private apiRole: iam.Role;
    constructor(parent: cdk.Construct, id: string, props: ContractApiGatewayConstructParms) {
        super(parent, id);
        this.props = props;
        /**
         * Create Base REST API
         */
        this.createRestApi();

        /**
         * Create API Gateway Role
         */
        this.createApiRole();

        /**
         * Add Resource and Methods.
         */
        this.addResourceAndMethods();

        this.createApiKey();
        this.addRoute53Alias();
    }

    createApiKey() {
        if (!this.props.envParameters.apiKeySecruity) {
            return;
        }
        const secret = new secretsmanager.Secret(this, 'Secret', {
            generateSecretString: {
                generateStringKey: 'api_key',
                secretStringTemplate: JSON.stringify({ username: 'web_user' }),
                excludeCharacters: ' %+~`#$&*()|[]{}:;<>?!\'/@"\\',
            },
        });
        this.restApi.addApiKey('ApiKey', {
            apiKeyName: `${constants.API_PREFIX}-${this.props.envParameters.shortEnv}`,
            value: secret.secretValueFromJson('api_key').toString(),
        });
    }

    private addGetContractsIntegration(contractResource: apigw.Resource) {
        contractResource.addMethod(
            'POST',
            new apigw.LambdaIntegration(this.props.contractLambdaFunctions.getContractsLambda!, {
                credentialsRole: this.apiRole,
            })
        );
    }

    private addGetContractDetailsByContractIdIntegration(contractResource: apigw.Resource) {
        contractResource.addResource('{contractid}').addMethod(
            'GET',
            new apigw.LambdaIntegration(this.props.contractLambdaFunctions.getContractDetailsByContractIdLambda!, {
                credentialsRole: this.apiRole,
            })
        );
    }

    private addGetContractDetailsByEntityIdIntegration(contractResource: apigw.Resource) {
        contractResource
            .addResource('entities')
            .addResource('{entityid}')
            .addMethod(
                'GET',
                new apigw.LambdaIntegration(this.props.contractLambdaFunctions.getContractDetailsByEntityIdLambda!, {
                    credentialsRole: this.apiRole,
                })
            );
    }

    private addResourceAndMethods() {
        const contractResource = this.restApi.root
            .addResource('contractinformation')
            .addResource('v1')
            .addResource('contracts');
        this.addGetContractsIntegration(contractResource);
        this.addGetContractDetailsByContractIdIntegration(contractResource);
        this.addGetContractDetailsByEntityIdIntegration(contractResource);
    }

    private createRestApi() {
        this.restApi = new apigw.RestApi(this, 'my-rest-api', {
            description: `${constants.API_PREFIX}-${this.props.envParameters.shortEnv}`,
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
    getApiGatewayResourcePolicy() {
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
                resources: [
                    this.props.contractLambdaFunctions.getContractDetailsByContractIdLambda?.functionArn!,
                    this.props.contractLambdaFunctions.getContractDetailsByEntityIdLambda?.functionArn!,
                    this.props.contractLambdaFunctions.getContractsLambda?.functionArn!,
                ],
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
            recordName: `contract-api-${this.props.envParameters.shortEnv}.${this.props.envParameters.domainSuffix}`,
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(this.restApi)),
        });
    }
}
