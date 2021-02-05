import * as cdk from '@aws-cdk/core';
import { ContractApiGatewayConstructParms } from '../models/contract/contract-api-gateway-construct-parms';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';

export class ContractApiGatewayConstruct extends cdk.Construct {
    private props: ContractApiGatewayConstructParms;
    private restApi: apigw.RestApi;
    constructor(parent: cdk.Construct, id: string, props: ContractApiGatewayConstructParms) {
        super(parent, id);
        this.props = props;
        this.createRestApi();
        const apiRole = this.createApiRole();
        const contractResource = this.addContractResourceAndMethods();
        this.addGetContractsIntegration(contractResource);
        this.addGetContractDetailsIntegration(contractResource);
    }

    addGetContractsIntegration(contractResource: apigw.Resource) {
        contractResource.addMethod('GET', new apigw.MockIntegration());
    }

    addGetContractDetailsIntegration(contractResource: apigw.Resource) {
        contractResource.addResource('{contractid}').addMethod('GET', new apigw.MockIntegration());
    }

    addGetContractEntities(contractResource: apigw.Resource) {
        contractResource
            .addResource('entityid')
            .addResource('{entityid}')
            .addMethod('POST', new apigw.MockIntegration());
    }

    addContractResourceAndMethods() {
        return this.restApi.root.addResource('contractinformation').addResource('v1').addResource('contracts');
    }

    createRestApi() {
        this.restApi = new apigw.RestApi(this, 'my-rest-api', {
            description: `contract-api-${this.props.envParameters.shortEnv}`,
            restApiName: `contract-api-${this.props.envParameters.shortEnv}`,
            endpointTypes: [apigw.EndpointType.REGIONAL],
            deployOptions: {
                stageName: `${this.props.envParameters.shortEnv}`,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            domainName: {
                domainName: `contract-api-${this.props.envParameters.shortEnv}.${this.props.envParameters.domainSuffix}`,
                certificate: acm.Certificate.fromCertificateArn(this, 'my-cert', this.props.envParameters.certArn!),
                endpointType: apigw.EndpointType.REGIONAL,
            },
        });
    }

    createApiRole(): iam.Role {
        const apiRole = new iam.Role(this, 'api-role', {
            roleName: 'apiRole',
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        });

        apiRole.addToPolicy(
            new iam.PolicyStatement({
                resources: ['*'],
                actions: ['lambda:InvokeFunction'],
            })
        );
        return apiRole;
    }
}
