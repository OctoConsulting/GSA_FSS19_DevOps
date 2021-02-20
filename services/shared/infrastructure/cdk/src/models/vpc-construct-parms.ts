import { EnvParameters } from './env-parms';

export interface VpcConstructParms {
    vpcId: string;
    maxAzs: number;
    availabilityZones: string[];
}
