import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(stackContext: any): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        const envParameters: EnvParameters = {
            shortEnv,
            vpc: stackContext.vpc,
            domainSuffix: stackContext.domainSuffix,
            certArn: stackContext.certArn,
            logLevel: stackContext.logLevel,
            artifactsBucket: stackContext.artifactsBucket,
            enableEncryptionAtRest: stackContext.enableEncryptionAtRest,
            logRetentionInDays: stackContext.logRetentionInDays,
            apiKeySecruity: stackContext.apiKeySecruity,
            xRayTracing: stackContext.xRayTracing,
        };
        return envParameters;
    }
}
