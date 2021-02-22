import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(stackContext: any): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        const envParameters: EnvParameters = {
            shortEnv,
            vpc: stackContext.vpc,
            maxAzs: stackContext.maxAzs,
        };
        return envParameters;
    }
}
