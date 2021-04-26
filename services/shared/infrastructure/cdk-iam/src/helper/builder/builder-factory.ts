import { ApiGatewayBuilder } from './apigateway-builder';
import { CloudwatchBuilder } from './cloudwatch-builder';
import { CloudwatchLogsBuilder } from './cloudwatch-logs-builder';
import { BaseBuilder } from './common/BaseBulider';
import { DynamoBuilder } from './dynamo-builder';
import { IamBuilder } from './iam-builder';
import { KmsBuilder } from './kms-builder';
import { LambdaBuilder } from './lambda-builder';
import { XrayBuilder } from './xray-builder';
import * as cdk from '@aws-cdk/core';
import { S3Builder } from './s3-builder';

function getPolicyBuilder(
    parent: cdk.Construct,
    id: string,
    permission: string,
    arnPrefix: string,
    resources: string[]
): BaseBuilder {
    if (permission.startsWith('dynamodb')) return new DynamoBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('logs')) return new CloudwatchLogsBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('apigateway')) return new ApiGatewayBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('xray')) return new XrayBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('lambda')) return new LambdaBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('cloudwatch')) return new CloudwatchBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('iam')) return new IamBuilder(parent, id, { permission, arnPrefix });

    if (permission.startsWith('kms')) return new KmsBuilder(parent, id, { permission, arnPrefix, resources });

    if (permission.startsWith('s3')) return new S3Builder(parent, id, { permission, arnPrefix, resources });

    throw Error(`Policy Builder entry missing in builder-factory.js for ${permission}`);
}

const builderFactory = {
    getPolicyBuilder,
};

export { builderFactory };
