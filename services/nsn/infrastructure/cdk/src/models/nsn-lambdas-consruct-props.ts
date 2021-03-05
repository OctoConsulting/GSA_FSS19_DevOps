import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface NsnLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    logRetentionInDays?: number;
    nsnTable: dynamodb.Table;
    xRayTracing: boolean;
}
