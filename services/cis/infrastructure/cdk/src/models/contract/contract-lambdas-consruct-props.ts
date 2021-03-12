import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface ContractLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    logRetentionInDays?: number;
    contractTable: dynamodb.Table;
    minCapacity?: number;
    xRayTracing: boolean;
}
