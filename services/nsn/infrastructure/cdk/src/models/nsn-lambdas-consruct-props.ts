import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { IVpc } from '@aws-cdk/aws-ec2';
export interface NsnLambdasConstructParms {
    mysqlDbName: string;
    shortEnv: string;
    vpc: IVpc;
    artifactBucket: string;
    artifactKey: string;
    logRetentionInDays?: number;
    nsnTable: dynamodb.Table;
    xRayTracing: boolean;
}
