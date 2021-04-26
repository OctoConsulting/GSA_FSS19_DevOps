import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as kms from '@aws-cdk/aws-kms';
import { S3ConstructProps } from '../models/s3-construct-props';

export class S3Construct extends cdk.Construct {
    private props: S3ConstructProps;
    readonly myBucket: s3.IBucket;
    private stack: cdk.Stack;

    constructor(parent: cdk.Construct, id: string, props: S3ConstructProps) {
        super(parent, id);
        this.props = props;
        this.stack = cdk.Stack.of(parent);

        this.myBucket = new s3.Bucket(this, 'Bucket', {
            bucketName: `${props.name}-${this.stack.account}-${this.stack.region}-${props.shortEnv}`,
            encryption: s3.BucketEncryption.KMS,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        new kms.Alias(this, `KmsKeyAlias`, {
            aliasName: `fss19/s3/atrest/${this.props.name.replace('-', '')}`,
            targetKey: this.myBucket.encryptionKey!,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new cdk.CfnOutput(this, 'BucketARN', {
            value: this.myBucket.bucketArn,
        });
    }
}
