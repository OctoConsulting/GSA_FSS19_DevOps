import * as ec2 from '@aws-cdk/aws-ec2';

export interface Endpoints {
    apiGatewayEndPoint?: ec2.InterfaceVpcEndpoint;
}
