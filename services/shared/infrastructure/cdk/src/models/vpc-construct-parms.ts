import { EnvParameters } from './env-parms';
import { IVpc, SubnetConfiguration } from '@aws-cdk/aws-ec2';

export interface VpcConstructParms {
    envParameters: EnvParameters;
    availabilityZones: string[];
    vpc: IVpc;
    stackContext: any;
}

export interface ExtendedSubnetConfiguration {
    subnetConfiguration: SubnetConfiguration,
    availibilityZonesCount: number
}