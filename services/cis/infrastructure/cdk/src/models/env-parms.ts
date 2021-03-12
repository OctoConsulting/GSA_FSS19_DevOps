export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    domainSuffix?: string;
    certArn?: string;
    enableEncryptionAtRest: boolean;
    logRetentionInDays: number;
    apiKeySecruity: boolean;
    minCapacityForLambda: number;
    xRayTracing: boolean;
}
