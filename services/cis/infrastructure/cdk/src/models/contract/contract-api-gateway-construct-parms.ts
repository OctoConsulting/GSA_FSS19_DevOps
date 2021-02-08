import { EnvParameters } from '../env-parms';
import { ContractLambdaFunctions } from './contract-lambda-functions';

export interface ContractApiGatewayConstructParms {
    envParameters: EnvParameters;
    contractLambdaFunctions: ContractLambdaFunctions;
}
