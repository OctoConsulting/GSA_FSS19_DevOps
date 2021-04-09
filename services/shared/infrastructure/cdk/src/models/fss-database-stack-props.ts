import { StackProps } from '@aws-cdk/core';
import { IVpc } from '@aws-cdk/aws-ec2';
export interface FssDatabaseStackProps extends StackProps {
    vpc: IVpc;
}
