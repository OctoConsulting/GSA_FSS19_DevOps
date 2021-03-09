import * as cdk from '@aws-cdk/core';

import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BuilderProps } from '../../../models/builder-props';

export class BaseBuilder extends cdk.Construct {
    protected props: BuilderProps;
    protected policyStatements: PolicyStatement[];

    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id);
        this.props = props;
        this.policyStatements = this.buildPolicyStatements();
    }

    buildPolicyStatements(): PolicyStatement[] {
        throw new Error(`Must be implimented in child class`);
    }

    public getPolicyStatements(): PolicyStatement[] {
        return this.policyStatements;
    }

    protected getServicePrefix(resource = '*', accountNo?: string, region?: string) {
        if (this.props.permission.startsWith('iam')) {
            resource = '';
            region = '';
        }
        const arnPrefix = cdk.Stack.of(this).formatArn({
            service: this.props.permission.substr(0, this.props.permission.indexOf('-')),
            resource: resource,
            account: accountNo,
            region: region,
        });

        return arnPrefix;
    }

    protected unimplimented(permission: string): PolicyStatement[] {
        throw new Error(`Permission not found for ${permission}`);
    }
}
