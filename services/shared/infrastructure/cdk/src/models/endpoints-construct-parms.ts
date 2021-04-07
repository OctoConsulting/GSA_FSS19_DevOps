import { EnvParameters } from './env-parms';
import { IVpc, ISubnet } from '@aws-cdk/aws-ec2';

export interface EndpointsConstructParms {
    envParameters: EnvParameters;
    vpc: IVpc;
    domainName: string;
    isolatedSubnets: ISubnet[];
    route53IsolatedResolverSubnets: ISubnet[];
}
