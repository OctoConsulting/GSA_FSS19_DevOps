export interface LambdaFunRequest {
    name: string;
    writeAccessToDynamo?: boolean;
    writeAccessToS3?: boolean;
    rdsAccess?: boolean;
    artifactPath?: string;
    handler?: string;
}
