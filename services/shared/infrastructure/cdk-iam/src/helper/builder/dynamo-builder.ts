import { PolicyStatement } from '@aws-cdk/aws-iam';
import { resourcePrefix } from '../resource-helper';
import { BaseBuilder } from './common/BaseBulider';

export class DynamoBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string) {
        super();
        this.permission = permission;
    }

    getServicePrefix() {
        return resourcePrefix.getPrefix('dynamodb');
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'dynamo-read') {
            return this.read();
        }
        if (this.permission === 'dynamo-crudItem') {
            return this.crudItem();
        }
        return this.unimplimented(this.permission);
    }

    private read(): PolicyStatement[] {
        const getIndex = new PolicyStatement({
            actions: ['dynamodb:Query', 'dynamodb:GetRecords'],
            resources: [`${this.getServicePrefix()}table/*/index/*`],
        });
        const list = new PolicyStatement({
            actions: ['dynamodb:ListTables', 'dynamodb:ListStreams'],
            resources: ['*'],
        });

        const getTable = new PolicyStatement({
            actions: [
                'dynamodb:BatchGetItem',
                'dynamodb:DescribeTable',
                'dynamodb:GetItem',
                'dynamodb:ListTagsOfResource',
                'dynamodb:Query',
            ],
            resources: [`${this.getServicePrefix()}table/*`],
        });
        return [getIndex, list, getTable];
    }

    private crudItem(): PolicyStatement[] {
        const crudItem = new PolicyStatement({
            actions: [
                'dynamodb:BatchGetItem',
                'dynamodb:BatchWriteItem',
                'dynamodb:ConditionCheckItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
            ],
            resources: [`${this.getServicePrefix()}table/*`],
        });
        return [crudItem];
    }
}
