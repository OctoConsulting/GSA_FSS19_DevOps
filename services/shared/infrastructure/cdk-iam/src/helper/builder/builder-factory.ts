import { ApiGatewayBuilder } from './apigateway-builder';
import { CloudwatchLogsBuilder } from './cloudwatch-logs-builder';
import { BaseBuilder } from './common/BaseBulider';
import { DynamoBuilder } from './dynamo-builder';
import { XrayBuilder } from './xray-builder';

function getPolicyBuilder(permission: string): BaseBuilder {
    if (permission.startsWith('dynamo')) return new DynamoBuilder(permission);

    if (permission.startsWith('logs')) return new CloudwatchLogsBuilder(permission);

    if (permission.startsWith('apigateway')) return new ApiGatewayBuilder(permission);

    if (permission.startsWith('xray')) return new XrayBuilder(permission);

    throw Error(`Policy Builder entry missing in builder-factory.js for ${permission}`);
}

const builderFactory = {
    getPolicyBuilder,
};

export { builderFactory };
