import { IamSet } from './iam-set';

export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    iamSets: IamSet[];
}
