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
        const groupName = this.props.iamSet.groupName;
        const group = new iam.Group(this, `${groupName}`, {
            groupName: groupName,
        });

        const roleName = this.props.iamSet.roleName;
        const role = new iam.Role(this, `role-${roleName}`, {
            description: roleName,
            roleName: roleName,
            assumedBy: new iam.FederatedPrincipal(this.props.samlProvider, {
                StringEquals: {
                    'SAML:aud': 'https://signin.aws.amazon.com/saml',
                },
            }),
        });

        const policy = new iam.Policy(this, 'policy', {
            policyName: this.props.iamSet.groupName,
            groups: [group],
            roles: [role],
        });

        this.props.iamSet.permissions.forEach((aRecord: any) => {
            var permission;
            var resources;
            if (typeof aRecord === 'string') {
                permission = aRecord;
            } else {
                permission = Object.keys(aRecord)[0];
                resources = aRecord[Object.keys(aRecord)[0]];
            }
            builderFactory
                .getPolicyBuilder(this, permission, permission, this.getArnPrefix(permission), resources)
                .getPolicyStatements()
                .forEach((x) => {
                    policy.addStatements(x);
                });
        });
    }

    getArnPrefix(permission: string): string {
        var accountNo = undefined;
        var region = undefined;
        var resource = undefined;
        if (permission.startsWith('apigateway')) {
            accountNo = '';
        }
        if (permission.startsWith('iam')) {
            resource = '';
            region = '';
        }

        const arnPrefix = this.stack.formatArn({
            service: permission.substr(0, permission.indexOf('-')),
            resource: '*',
            account: accountNo,
            region: region,
        });
        return arnPrefix;
    }
}
