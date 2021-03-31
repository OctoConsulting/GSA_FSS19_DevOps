import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface AllLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    artifactBucket: string;
    artifactKey: string;
    logRetentionInDays?: number;
    contractConstTable: dynamodb.Table;
    xRayTracing: boolean;
}
