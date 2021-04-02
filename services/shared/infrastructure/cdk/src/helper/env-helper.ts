import { EnvParameters } from '../models/env-parms';
import { StackProps } from '@aws-cdk/core';

export class EnvHelper {
    getEnvironmentParams(stackContext: any, props: StackProps): EnvParameters {
        const shortEnv = process.env.SHORT_ENV!;
        const envParameters: EnvParameters = {
            shortEnv,
            vpcId: stackContext.vpcId,
            region: props.env?.region,
            domainName: stackContext.domainName,
            account: props.env?.account,
        };
        return envParameters;
    }
}
