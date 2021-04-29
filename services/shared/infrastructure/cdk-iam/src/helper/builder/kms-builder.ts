import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import { BuilderProps } from '../../models/builder-props';

export class KmsBuilder extends BaseBuilder {
    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (!this.props.resources || this.props.resources.length == 0) {
            return [];
        }

        if (this.props.permission === 'kms-encrypt') {
            return this.encrypt(this.props.resources!);
        }
        if (this.props.permission === 'kms-decrypt') {
            return this.decrypt(this.props.resources!);
        }
        return this.unimplimented(this.props.permission);
    }

    private encrypt(resources: string[]): PolicyStatement[] {
        var policies: PolicyStatement[] = [];
        var keyArns: string[] = [];
        resources.forEach((resource) => {
            keyArns.push(`${this.getServicePrefix('')}key/${resource}`);
        });

        policies.push(
            new PolicyStatement({
                actions: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                resources: keyArns,
            })
        );

        return policies;
    }

    private decrypt(resources: string[]): PolicyStatement[] {
        var policies: PolicyStatement[] = [];

        var keyArns: string[] = [];
        resources.forEach((resource) => {
            keyArns.push(`${this.getServicePrefix('')}key/${resource}`);
        });

        policies.push(
            new PolicyStatement({
                actions: ['kms:Decrypt', 'kms:DescribeKey'],
                resources: keyArns,
            })
        );

        return policies;
    }
}
