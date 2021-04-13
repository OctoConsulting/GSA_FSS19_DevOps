export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    domainSuffix?: string;
    artifactsBucket: string;
    logLevel: string;
    certArn?: string;
    enableEncryptionAtRest: boolean;
    logRetentionInDays: number;
    apiKeySecruity: boolean;
    xRayTracing: boolean;
}
