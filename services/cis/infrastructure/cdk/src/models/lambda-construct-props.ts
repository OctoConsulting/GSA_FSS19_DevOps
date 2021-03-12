export interface LambdaConstructProps {
    functionName: string;
    lambdaEnvParameters?: any;
    vpcId?: string;
    assetLocation: string;
    timeout?: number;
    memorySize?: number;
    exportResource?: boolean;
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
