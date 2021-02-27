import { SubnetConfiguration } from '@aws-cdk/aws-ec2';

export interface EnvParameters {
    shortEnv: string;
    vpcId: string;
    maxAzs?: number;
    addonRoutesCidrs?: string[];
    addonRoutesVgw?: string;
    subnetConfiguration: SubnetConfiguration[];
}
