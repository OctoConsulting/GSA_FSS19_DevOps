import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import { BuilderProps } from '../../models/builder-props';
export class DynamoBuilder extends BaseBuilder {
    private permission: string;

    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 'dynamodb-read') {
            return this.read();
        }
        if (this.props.permission === 'dynamodb-crudItem') {
            return this.crudItem();
        }
        return this.unimplimented(this.props.permission);
    }

    private read(): PolicyStatement[] {
        const getIndex = new PolicyStatement({
            actions: ['dynamodb:Query', 'dynamodb:GetRecords'],
            resources: [`${this.getServicePrefix('')}table/*/index/*`],
        });
        const list = new PolicyStatement({
            actions: ['dynamodb:List*', 'dynamodb:BatchGet*', 'dynamodb:Describe*', 'dynamodb:Get*'],
            resources: ['*'],
        });

        const getTable = new PolicyStatement({
            actions: ['dynamodb:Query', 'dynamodb:Scan'],
            resources: [`${this.getServicePrefix('')}table/*`],
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
            resources: [`${this.getServicePrefix('')}table/*`],
        });
        // const kmsEncrypt = new KmsBuilder('kms-encrypt', '*').getPolicyStatements();
        // const kmsDecrypt = new KmsBuilder('kms-decrypt', '*').getPolicyStatements();
        // return [crudItem, ...kmsEncrypt, ...kmsDecrypt];
        return [crudItem];
    }
}
