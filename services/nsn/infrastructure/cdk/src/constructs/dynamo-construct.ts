import * as cdk from '@aws-cdk/core';
import { DynamoConstructParms } from '../models/dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class DynamoConstruct extends cdk.Construct {
    private nsnTable: dynamodb.Table;
    private props: DynamoConstructParms;

    constructor(parent: cdk.Construct, id: string, props: DynamoConstructParms) {
        super(parent, id);
        this.props = props;
        this.createDynamoDbTable();
    }

    private createDynamoDbTable() {
        /**
         * Create Table
         */
        this.createMainTable();

        /**
         * Set stackoutputs
         */
        this.setOutputs();
    }

    private createMainTable() {
        this.nsnTable = new dynamodb.Table(this, 'dynamodb-table', {
            tableName: `nsn-routing-${this.props.shortEnv}`,
            partitionKey: { name: 'group_id', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'routing_id', type: dynamodb.AttributeType.STRING },
            pointInTimeRecovery: true,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption: this.props.enableEncryptionAtRest
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.DEFAULT,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });
    }

    private setOutputs() {
        new cdk.CfnOutput(this, 'table-name-output', {
            value: this.nsnTable.tableName,
            description: 'NSN DynamoDB table name',
        });
        new cdk.CfnOutput(this, 'table-arn-output', {
            value: this.nsnTable.tableArn,
            description: 'NSN DynamoDB table Arn',
        });
        new cdk.CfnOutput(this, 'table-streams-arn-output', {
            value: this.nsnTable.tableStreamArn!,
            description: 'NSN DynamoDB table Arn',
        });
    }

    getNsnTable(): dynamodb.Table {
        return this.nsnTable;
    }
}
