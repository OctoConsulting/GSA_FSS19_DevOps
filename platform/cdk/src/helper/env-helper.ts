import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(): EnvParameters {
        const envParameters: EnvParameters = {
            shortEnv: process.env.SHORT_ENV!,
        };
        return envParameters;
    }
}
