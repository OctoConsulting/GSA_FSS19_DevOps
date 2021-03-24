import * as ec2 from '@aws-cdk/aws-ec2';

export interface LambdaConstructProps {
    functionName: string;
    lambdaEnvParameters?: any;
    vpc: ec2.IVpc;
    securityGroup: ec2.ISecurityGroup;
    assetLocation?: string;
    timeout?: number;
    memorySize?: number;
    exportResource?: boolean;
    artifactBucket?: string;
    artifactKey?: string;
    artifactVersion?: string;
    handler?: string;
    logRetentionInDays?: number;
    minCapacity?: number;
    type: LambdaConstructProps.LambdaTypeEnum;
    xRayTracing?: boolean;
}

export namespace LambdaConstructProps {
    export type LambdaTypeEnum = 'JAVA' | 'NODEJS';
    export const LambdaTypeEnum = {
        JAVA: 'JAVA' as LambdaTypeEnum,
        NODEJS: 'NODEJS' as LambdaTypeEnum,
    };
}
