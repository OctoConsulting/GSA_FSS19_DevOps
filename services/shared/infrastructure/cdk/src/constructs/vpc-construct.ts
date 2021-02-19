import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcConstructParms } from '../models/vpc-construct-parms';

export class VpcConstruct extends cdk.Construct {
    private myVpc: ec2.IVpc;
    private props: VpcConstructParms;
    constructor(parent: cdk.Construct, id: string, props: VpcConstructParms) {
        super(parent, id);
        this.props = props;

        this.myVpc = ec2.Vpc.fromLookup(this, 'vpc-setup-lookup', {
            vpcId: props.vpcId,
        });

        /**
         * Private and Isolated Subnets
         */
        this.addSubnets();
    }

    addSubnets() {}
}
