import { PolicyStatement } from '@aws-cdk/aws-iam';
import { resourcePrefix } from '../resource-helper';
import { BaseBuilder } from './common/BaseBulider';

export class DynamoBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'dynamodb-read') {
            return this.read();
        }
        if (this.permission === 'dynamodb-crudItem') {
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
            actions: ['dynamodb:List*', 'dynamodb:BatchGet*', 'dynamodb:Describe*', 'dynamodb:Get*'],
            resources: ['*'],
        });

        const getTable = new PolicyStatement({
            actions: ['dynamodb:Query', 'dynamodb:Scan'],
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
