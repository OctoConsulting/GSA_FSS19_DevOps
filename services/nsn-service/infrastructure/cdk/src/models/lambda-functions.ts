import * as lambda from '@aws-cdk/aws-lambda';

export interface LambdaFunctions {
    getNsnServiceDetails: lambda.IFunction;
}
