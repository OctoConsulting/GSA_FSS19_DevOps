import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import { BuilderProps } from '../../models/builder-props';
export class S3Builder extends BaseBuilder {
    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 's3-read') {
            return this.read(this.props.resources!);
        }
        if (this.props.permission === 's3-write') {
            return this.write(this.props.resources!);
        }
        return this.unimplimented(this.props.permission);
    }

    private read(resources: string[]): PolicyStatement[] {
        var bucketObjectArns: string[] = [];
        resources.forEach((resource) => {
            bucketObjectArns.push(`${this.getServicePrefix('')}${resource}/*`);
        });
        const get = new PolicyStatement({
            actions: ['s3:GetObject*'],
            resources: bucketObjectArns,
        });

        var bucketArns: string[] = [];

        resources.forEach((resource) => {
            bucketArns.push(`${this.getServicePrefix('')}${resource}`);
        });
        const list = new PolicyStatement({
            actions: ['s3:ListBucket*'],
            resources: bucketArns,
        });

        return [get, list];
    }

    private write(resources: string[]): PolicyStatement[] {
        var bucketObjectArns: string[] = [];
        resources.forEach((resource) => {
            bucketObjectArns.push(`${this.getServicePrefix('')}${resource}/*`);
        });

        const writeObject = new PolicyStatement({
            actions: ['s3:PutObject'],
            resources: bucketObjectArns,
        });
        return [writeObject];
    }
}
