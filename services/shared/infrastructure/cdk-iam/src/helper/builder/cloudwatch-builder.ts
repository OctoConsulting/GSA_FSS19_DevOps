import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import { BuilderProps } from '../../models/builder-props';
export class CloudwatchBuilder extends BaseBuilder {
    private permission: string;

    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 'cloudwatch-read') {
            return this.read();
        }

        return this.unimplimented(this.props.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
            resources: [`${this.getServicePrefix()}`],
        });
        return [read];
    }
}
