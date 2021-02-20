import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(stackContext: any): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        const envParameters: EnvParameters = {
            shortEnv,
            vpc: stackContext.vpc,
            maxAzs: stackContext.maxAzs,
            domainSuffix: stackContext.domainSuffix,
            certArn: stackContext.certArn,
            enableEncryptionAtRest: stackContext.enableEncryptionAtRest,
            logRetentionInDays: stackContext.logRetentionInDays,
            apiKeySecruity: stackContext.apiKeySecruity,
            xRayTracing: stackContext.xRayTracing,
        };
        return envParameters;
    }
}
