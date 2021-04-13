import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { LambdaFunRequest } from './lambda-fun-request';
export interface AllLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    artifactBucket: string;
    logRetentionInDays?: number;
    logLevel: string;
    sharedArtifactPath?: string;
    dynamoTable: dynamodb.Table;
    xRayTracing: boolean;
    lambdaFuns: LambdaFunRequest[];
}
