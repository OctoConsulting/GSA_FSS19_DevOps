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
            return this.read();
        }
        if (this.props.permission === 's3-write') {
            return this.write();
        }
        return this.unimplimented(this.props.permission);
    }

    private read(): PolicyStatement[] {
        const get = new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [`${this.getServicePrefix('')}*/*`],
        });
        // const list = new PolicyStatement({
        //     actions: ['s3:ListBucket'],
        //     resources: [`${this.getServicePrefix('')}`],
        // });
        const listAll = new PolicyStatement({
            actions: ['s3:ListAllMyBuckets', 's3:ListBuckets'],
            resources: [`*`],
        });
        const all = new PolicyStatement({
            actions: ['s3:*'],
            resources: [`*`],
        });

        return [get, listAll, all];
    }

    private write(): PolicyStatement[] {
        const writeObject = new PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [`${this.getServicePrefix('')}/*`],
        });
        return [writeObject];
    }
}
