import { BaseBuilder } from './common/BaseBulider';
import { DynamoBuilder } from './dynamo-builder';

function getPolicyBuilder(permission: string): BaseBuilder {
    if (permission.startsWith('dynamo')) return new DynamoBuilder(permission);

    throw Error(`No Policy for permission ${permission}`);
}

const builderFactory = {
    getPolicyBuilder,
};

export { builderFactory };
