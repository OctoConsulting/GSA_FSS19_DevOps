import * as cdk from '@aws-cdk/core';
import { EnvHelper } from './helper/env-helper';
import { CrossStackImporter } from './helper/CrossStackImporter';
import { EnvParameters } from './models/env-parms';
import { DynamoConstruct } from './constructs/dynamo-construct';
import { ApiGatewayConstruct } from './constructs/api-gateway-construct';
import { AllLambdasConstruct } from './constructs/all-lambdas-construct';
import { constants } from './models/constants';
export class ContractConstApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);

        const dynamoDbConstruct = new DynamoConstruct(this, 'dynamo', {
            enableEncryptionAtRest: envParameters.enableEncryptionAtRest,
            shortEnv: envParameters.shortEnv,
            tablePrefix: constants.TABLE_PREFIX,
        });
        const crossStackImporter = new CrossStackImporter(this, 'corss-stack-imports', envParameters);

        const lambdas = new AllLambdasConstruct(this, 'lambdas', {
            contractConstTable: dynamoDbConstruct.getTable(),
            shortEnv: envParameters.shortEnv,
            vpc: envParameters.vpc,
            xRayTracing: true,
            artifactBucket: envParameters.artifactsBucket,
            logRetentionInDays: 30,
            lambdaFuns: [
                {
                    artifactPath: `${constants.LAMBDA_ARTIFACT_PATH_PREFIX}/${constants.FUNCTION_NAMES.GET_CONTRACT_ACO_OFFICE_ADDRESS_DETAILS_NAME}/index.zip`,
                    name: `${constants.FUNCTION_NAMES.GET_CONTRACT_ACO_OFFICE_ADDRESS_DETAILS_NAME}`,
                    handler: 'index.getContractAcoOfficeAddressDetailsData',
                },
                {
                    artifactPath: `${constants.LAMBDA_ARTIFACT_PATH_PREFIX}/${constants.FUNCTION_NAMES.GET_CONTRACT_BUYER_DETAILS_NAME}/index.zip`,
                    name: `${constants.FUNCTION_NAMES.GET_CONTRACT_BUYER_DETAILS_NAME}`,
                    handler: 'index.getContractBuyerDetails',
                },
                {
                    artifactPath: `${constants.LAMBDA_ARTIFACT_PATH_PREFIX}/${constants.FUNCTION_NAMES.GET_CONTRACT_NOTES_DETAILS_NAME}/index.zip`,
                    name: `${constants.FUNCTION_NAMES.GET_CONTRACT_NOTES_DETAILS_NAME}`,
                    handler: 'index.getNotesDetailsData',
                },
                {
                    artifactPath: `${constants.LAMBDA_ARTIFACT_PATH_PREFIX}/${constants.FUNCTION_NAMES.GET_CONTRACT_VENDOR_ADDRESS_DETAILS_NAME}/index.zip`,
                    name: `${constants.FUNCTION_NAMES.GET_CONTRACT_VENDOR_ADDRESS_DETAILS_NAME}`,
                    handler: 'index.getContractVendorAddressDetails',
                },
            ],
        });

        new ApiGatewayConstruct(this, 'api', {
            envParameters: envParameters,
            lambdaFunctions: {
                getContractAcoOfficeAddressDetailsLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.GET_CONTRACT_ACO_OFFICE_ADDRESS_DETAILS_NAME)[0]
                    .function,
                getContractBuyerLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.GET_CONTRACT_BUYER_DETAILS_NAME)[0].function,
                getContractNotesLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.GET_CONTRACT_NOTES_DETAILS_NAME)[0].function,
                getContractVendorAddressDetailsLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.GET_CONTRACT_VENDOR_ADDRESS_DETAILS_NAME)[0]
                    .function,
            },
            iVpcEndpoint: crossStackImporter.getCrossStackImports().apiGatewayVpcEndpoint,
        });
    }
}
