import * as lambda from '@aws-cdk/aws-lambda';

export interface LambdaFunctions {
    postRoutingLambda?: lambda.IFunction;
    putRoutingLambda?: lambda.IFunction;
    getRoutingLambda?: lambda.IFunction;
    deleteRoutingLambda?: lambda.IFunction;
    nsnRoutingFileProcessorLambda?: lambda.IFunction;
}
