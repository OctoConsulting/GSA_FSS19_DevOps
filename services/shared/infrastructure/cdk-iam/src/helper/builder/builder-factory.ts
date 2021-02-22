import { ApiGatewayBuilder } from './apigateway-builder';
import { CloudwatchLogsBuilder } from './cloudwatch-logs-builder';
import { BaseBuilder } from './common/BaseBulider';
import { DynamoBuilder } from './dynamo-builder';
import { LambdaBuilder } from './lambda-builder';
import { XrayBuilder } from './xray-builder';

function getPolicyBuilder(permission: string, arnPrefix: string): BaseBuilder {
    if (permission.startsWith('dynamo')) return new DynamoBuilder(permission, arnPrefix);

    if (permission.startsWith('logs')) return new CloudwatchLogsBuilder(permission, arnPrefix);

    if (permission.startsWith('apigateway')) return new ApiGatewayBuilder(permission, arnPrefix);

    if (permission.startsWith('xray')) return new XrayBuilder(permission, arnPrefix);

    if (permission.startsWith('lambda')) return new LambdaBuilder(permission, arnPrefix);

    throw Error(`Policy Builder entry missing in builder-factory.js for ${permission}`);
}

const builderFactory = {
    getPolicyBuilder,
};

export { builderFactory };
