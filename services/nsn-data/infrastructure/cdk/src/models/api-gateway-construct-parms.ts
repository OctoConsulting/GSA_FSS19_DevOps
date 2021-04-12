import { EnvParameters } from './env-parms';
import { LambdaFunctions } from './lambda-functions';
import * as ec2 from '@aws-cdk/aws-ec2';
export interface ApiGatewayConstructParms {
    envParameters: EnvParameters;
    lambdaFunctions: LambdaFunctions;
    iVpcEndpoint?: ec2.IVpcEndpoint;
}
