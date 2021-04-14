import * as lambda from '@aws-cdk/aws-lambda';

export interface LambdaFunctions {
    getEntityDetails: lambda.IFunction;
}
