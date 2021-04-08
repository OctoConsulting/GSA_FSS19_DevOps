import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc } from '@aws-cdk/aws-ec2';
export interface CrossStackImports {
    apiGatewayVpcEndpoint: ec2.IVpcEndpoint;
    vpc: IVpc;
}
