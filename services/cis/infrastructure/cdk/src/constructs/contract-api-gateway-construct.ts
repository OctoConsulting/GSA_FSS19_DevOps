import * as cdk from '@aws-cdk/core';
import { ContractApiGatewayConstructParms } from '../models/contract/contract-api-gateway-construct-parms';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';

export class ContractApiGatewayConstruct extends cdk.Construct {
    private props: ContractApiGatewayConstructParms;
    private restApi: apigw.RestApi;
    private apiRole: iam.Role;
    constructor(parent: cdk.Construct, id: string, props: ContractApiGatewayConstructParms) {
        super(parent, id);
        this.props = props;
        this.createRestApi();
        this.createApiRole();
        const contractResource = this.addContractResourceAndMethods();
        this.addGetContractsIntegration(contractResource);
        this.addGetContractDetailsByContractIdIntegration(contractResource);
        this.addGetContractDetailsByEntityIdIntegration(contractResource);
        this.addRoute53Alias();
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

    private addContractResourceAndMethods() {
        return this.restApi.root.addResource('contractinformation').addResource('v1').addResource('contracts');
    }

    private createRestApi() {
        this.restApi = new apigw.RestApi(this, 'my-rest-api', {
            description: `contract-api-${this.props.envParameters.shortEnv}`,
            restApiName: `contract-api-${this.props.envParameters.shortEnv}`,
            endpointTypes: [apigw.EndpointType.REGIONAL],
            deployOptions: {
                stageName: `${this.props.envParameters.shortEnv}`,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            domainName: this.props.envParameters.domainSuffix
                ? {
                      domainName: `contract-api-${this.props.envParameters.shortEnv}.${this.props.envParameters.domainSuffix}`,
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

    private createApiRole() {
        this.apiRole = new iam.Role(this, 'api-role', {
            roleName: 'apiRole',
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        });

        this.apiRole.addToPolicy(
            new iam.PolicyStatement({
                resources: ['*'],
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
