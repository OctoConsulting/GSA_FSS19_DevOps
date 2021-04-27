import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc } from '@aws-cdk/aws-ec2';
import { RdsDbProps } from './rds-db-props';
export interface CrossStackImports {
    apiGatewayVpcEndpoint: ec2.IVpcEndpoint;
    vpc: IVpc;
    rdsDbProps: RdsDbProps;
}
