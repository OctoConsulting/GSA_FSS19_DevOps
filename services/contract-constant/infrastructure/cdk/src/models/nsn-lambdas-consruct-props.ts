import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface NsnLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    artifactBucket: string;
    artifactKey: string;
    logRetentionInDays?: number;
    nsnTable: dynamodb.Table;
    xRayTracing: boolean;
}
