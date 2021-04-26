import { IamSet } from './iam-set';
import { IdentityProvider } from './identity-provider';

export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    samlProvider: string;
    iamSets: IamSet[];
    identityProvider: IdentityProvider;
}
