import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { S3ConstructProps } from '../../models/s3-construct-props';

export class S3Construct extends cdk.Construct {
    private props: S3ConstructProps;
    constructor(parent: cdk.Construct, id: string, props: S3ConstructProps) {
        super(parent, id);

        const bucket = new s3.Bucket(this, `${id}-bucket`, {
            encryption: s3.BucketEncryption.KMS,
            bucketName: props.bucketName,
            versioned: true,
        });
    }
}
