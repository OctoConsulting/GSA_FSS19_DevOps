import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import { BuilderProps } from '../../models/builder-props';
import { Key } from '@aws-cdk/aws-kms';
export class KmsBuilder extends BaseBuilder {
    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 'kms-encrypt') {
            return this.encrypt(this.props.resources!);
        }
        if (this.props.permission === 'kms-decrypt') {
            return this.decrypt(this.props.resources!);
        }
        return this.unimplimented(this.props.permission);
    }

    private encrypt(resources: string[]): PolicyStatement[] {
        console.log('resources array', resources);
        var policies: PolicyStatement[] = [];
        resources.forEach((resource) => {
            // const kmsKey = kms.Alias.fromAliasName(this, `${resource}`, resource);
            policies.push(
                new PolicyStatement({
                    actions: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                    resources: [`${this.getServicePrefix('')}key/${resource}`],
                })
            );
        });

        return policies;
    }

    private decrypt(resources: string[]): PolicyStatement[] {
        var policies: PolicyStatement[] = [];
        resources.forEach((resource) => {
            const kmsKey = kms.Alias.fromAliasName(this, `${resource}`, resource);
            policies.push(
                new PolicyStatement({
                    actions: ['kms:Decrypt', 'kms:DescribeKey'],
                    resources: [`${this.getServicePrefix('')}key/${resource}`],
                })
            );
        });

        return policies;
    }
}
