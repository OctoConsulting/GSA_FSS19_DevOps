import { EnvParameters } from './env-parms';
import { IPrivateSubnet, IVpc } from '@aws-cdk/aws-ec2'

export interface JenkinsConstructParms {
    envParameters: EnvParameters;
    stackContext: any;
    vpc: IVpc;
    ciCdSubnets: IPrivateSubnet[];
    cognitoUserPoolSecretArn: string;

}

export interface CreateSecretsProps {
    githubTokenSecretArn: string;
    cognitoUserPoolSecretArn: string;
}

export interface CreateClusterProps {
    vpc: IVpc;
    defaultNamespace: string;
}

