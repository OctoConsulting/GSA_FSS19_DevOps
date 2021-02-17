import * as cdk from '@aws-cdk/core';
import { ContractApiGatewayConstruct } from './constructs/contract-api-gateway-construct';
import { ContractDynamoConstruct } from './constructs/contract-dynamo-construct';
import { ContractLambdasConstruct } from './constructs/contract-lambdas-construct';
import { S3Construct } from './constructs/shared/s3-construct';
import { CrossStackImporter } from './helper/CrossStackImporter';
import { EnvHelper } from './helper/env-helper';
import { ContractLambdaFunctions } from './models/contract/contract-lambda-functions';
import { EnvParameters } from './models/env-parms';

export class ContractApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);

        const dynamoDbConstruct = new ContractDynamoConstruct(this, 'contract-dynamo', {
            enableEncryptionAtRest: envParameters.enableEncryptionAtRest,
            shortEnv: envParameters.shortEnv,
        });
        const crossStackImporter = new CrossStackImporter(this, 'corss-stack-imports', envParameters);

        const contractLambas = new ContractLambdasConstruct(this, 'contract-lambdas', {
            shortEnv: envParameters.shortEnv,
            vpc: envParameters.vpc,
            logRetentionInDays: envParameters.logRetentionInDays,
            contractTable: dynamoDbConstruct.getContractTable(),
            xRayTracing: envParameters.xRayTracing,
        });

        const contractLambdaFunctions: ContractLambdaFunctions = contractLambas.getContractLambdaFunctions();

        new ContractApiGatewayConstruct(this, 'contract-api', {
            envParameters,
            contractLambdaFunctions,
            iVpcEndpoint: crossStackImporter.getCrossStackImports().apiGatewayVpcEndpoint,
        });

        new S3Construct(this, 'contract-s3', {
            bucketName: `fss-contract-bucket-raw-events-${envParameters.shortEnv}`,
        });
    }
}
