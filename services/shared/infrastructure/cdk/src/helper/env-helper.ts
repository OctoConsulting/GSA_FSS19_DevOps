import { EnvParameters } from '../models/env-parms';

export class EnvHelper {
    getEnvironmentParams(stackContext: any): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        const envParameters: EnvParameters = {
            shortEnv,
            vpcId: stackContext.vpcId,
            maxAzs: stackContext.maxAzs,
            addonRoutesCidrs: stackContext.addonRoutesCidrs,
            addonRoutesVgw: stackContext.addonRoutesVgw,
            subnetConfiguration: stackContext.subnetConfiguration
        };
        return envParameters;
    }
}
