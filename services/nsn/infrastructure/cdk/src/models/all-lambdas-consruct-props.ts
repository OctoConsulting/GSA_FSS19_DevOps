import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { LambdaFunRequest } from './lambda-fun-request';
import * as s3 from '@aws-cdk/aws-s3';
import { RdsDbProps } from './rds-db-props';
export interface AllLambdasConstructParms {
    shortEnv: string;
    vpc: string;
    artifactBucket: string;
    logRetentionInDays?: number;
    sharedArtifactPath?: string;
    dynamoTable?: dynamodb.Table;
    s3Bucket?: s3.IBucket;
    rdsDbProps?: RdsDbProps;
    xRayTracing: boolean;
    lambdaFuns: LambdaFunRequest[];
}
