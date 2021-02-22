import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { PolicyConstructProps } from '../models/policy-construct-props';
import { builderFactory } from '../helper/builder/builder-factory';
import { Stack } from '@aws-cdk/core';

export class PolicyConstruct extends cdk.Construct {
    private props: PolicyConstructProps;
    stack: Stack;
    constructor(parent: cdk.Construct, id: string, props: PolicyConstructProps) {
        super(parent, id);
        this.props = props;
        this.stack = cdk.Stack.of(parent);
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
                .getPolicyBuilder(permission, this.getArnPrefix(permission))
                .getPolicyStatements()
                .forEach((x) => {
                    policy.addStatements(x);
                });
        });
    }

    getArnPrefix(permission: string): string {
        var accountNo = undefined;
        if (permission.startsWith('apigateway')) {
            accountNo = '';
        }
        const arnPrefix = this.stack.formatArn({
            service: permission.substr(0, permission.indexOf('-')),
            resource: '*',
            account: accountNo,
        });
        return arnPrefix;
    }
}
