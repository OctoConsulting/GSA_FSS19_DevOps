export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    maxAzs?: number;
    domainSuffix?: string;
    certArn?: string;
    enableEncryptionAtRest: boolean;
    logRetentionInDays: number;
    apiKeySecruity: boolean;
    xRayTracing: boolean;
}
