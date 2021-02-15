import * as lambda from '@aws-cdk/aws-lambda';

export interface ContractLambdaFunctions {
    getContractsLambda?: lambda.IFunction;
    getContractDetailsByContractIdLambda?: lambda.IFunction;
    getContractDetailsByEntityIdLambda?: lambda.IFunction;
}
