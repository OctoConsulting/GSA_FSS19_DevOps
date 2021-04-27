import * as lambda from '@aws-cdk/aws-lambda';

export interface BatchJobConstructParms {
    cronExpression: string;
    lamdaFunction: lambda.IFunction;
}
