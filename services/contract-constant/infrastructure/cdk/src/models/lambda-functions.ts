import * as lambda from '@aws-cdk/aws-lambda';

export interface LambdaFunctions {
    getContractNotesLambda: lambda.IFunction;
    getContractBuyerLambda: lambda.IFunction;
    getContractVendorAddressDetailsLambda: lambda.IFunction;
    getContractAcoOfficeAddressDetailsLambda: lambda.IFunction;
}
