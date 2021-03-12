import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface ContractLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    logRetentionInDays?: number;
    contractTable: dynamodb.Table;
    artifactBucket: string;
    artifactKey: string;
    minCapacity?: number;
    xRayTracing: boolean;
}
