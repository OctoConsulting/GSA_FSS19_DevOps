import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(stackContext: any): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        console.log('stackContext.iamSets', stackContext.iamSets);
        const envParameters: EnvParameters = {
            shortEnv,
            vpc: stackContext.vpc,
            iamSets: stackContext.iamSets,
        };
        return envParameters;
    }
}
