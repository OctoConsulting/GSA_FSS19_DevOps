import { IamSet } from './iam-permissions';

export interface EnvParameters {
    shortEnv: string;
    vpc: string;
    iamSets: IamSet[];
}
