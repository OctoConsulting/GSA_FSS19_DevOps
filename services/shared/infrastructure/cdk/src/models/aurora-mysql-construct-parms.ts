import { IVpc } from '@aws-cdk/aws-ec2';

export interface AuroraMysqlParms {
    shortEnv: string;
    vpc: IVpc;
    stackContext: any;
    account: string;
}
