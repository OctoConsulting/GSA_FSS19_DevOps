import { EnvParameters } from './env-parms';
import { IVpc } from '@aws-cdk/aws-ec2';

export interface VpcConstructParms {
    envParameters: EnvParameters;
    availabilityZones: string[];
    vpc: IVpc;
    stackContext: any;
}
