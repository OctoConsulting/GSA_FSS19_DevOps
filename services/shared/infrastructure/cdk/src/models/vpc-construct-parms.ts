import { EnvParameters } from './env-parms';

export interface VpcConstructParms {
    envParameters: EnvParameters;
    availabilityZones: string[];
}
