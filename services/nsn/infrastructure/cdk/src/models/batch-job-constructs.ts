import * as lambda from '@aws-cdk/aws-lambda';

export interface BatchJobConstructParms {
    name: string;
    cronExpression: string;
    description: string;
    shortEnv: string;
    lamdaFunction: lambda.IFunction;
}
