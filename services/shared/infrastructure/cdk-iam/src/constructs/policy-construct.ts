import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { PolicyConstructProps } from '../models/policy-construct-props';
import { builderFactory } from '../helper/builder/builder-factory';

export class PolicyConstruct extends cdk.Construct {
    private props: PolicyConstructProps;
    constructor(parent: cdk.Construct, id: string, props: PolicyConstructProps) {
        super(parent, id);
        this.props = props;
        this.createPolicy();
    }

    createPolicy() {
        console.log('Building Policies for', this.props.iamSet);
        const groupName = this.props.iamSet.groupName;
        const group = new iam.Group(this, `${groupName}`, {
            groupName: groupName,
        });

        const policy = new iam.Policy(this, 'policy', {
            policyName: 'fss-developers',
            groups: [group],
        });

        this.props.iamSet.permissions.forEach((permission: string) => {
            builderFactory
                .getPolicyBuilder(permission)
                .getPolicyStatements()
                .forEach((x) => {
                    policy.addStatements(x);
                });
        });
    }
}
