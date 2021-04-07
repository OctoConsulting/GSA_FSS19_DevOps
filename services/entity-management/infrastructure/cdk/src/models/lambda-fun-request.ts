export interface LambdaFunRequest {
    name: string;
    writeAccessToDynamo?: boolean;
    artifactPath: string;
    handler?: string;
}
