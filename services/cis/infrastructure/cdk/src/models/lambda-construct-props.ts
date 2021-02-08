export interface LambdaConstructProps {
    functionName: string;
    lambdaEnvParameters?: any;
    vpcId: string;
    assetLocation: string;
    timeout?: number;
    memorySize?: number;
    withInVpc?: boolean;
    exportResource?: boolean;
    handler?: string;
    type: LambdaConstructProps.LambdaTypeEnum;
}

export namespace LambdaConstructProps {
    export type LambdaTypeEnum = 'JAVA' | 'NODEJS';
    export const LambdaTypeEnum = {
        JAVA: 'JAVA' as LambdaTypeEnum,
        NODEJS: 'NODEJS' as LambdaTypeEnum,
    };
}
