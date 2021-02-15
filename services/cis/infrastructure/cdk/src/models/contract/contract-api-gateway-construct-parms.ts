import { EnvParameters } from '../env-parms';
import { ContractLambdaFunctions } from './contract-lambda-functions';
import * as ec2 from '@aws-cdk/aws-ec2';
export interface ContractApiGatewayConstructParms {
    envParameters: EnvParameters;
    contractLambdaFunctions: ContractLambdaFunctions;
    iVpcEndpoint?: ec2.IVpcEndpoint;
}
