import { IamSet } from './iam-set';

export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    samlProvider: string;
    iamSets: IamSet[];
}
