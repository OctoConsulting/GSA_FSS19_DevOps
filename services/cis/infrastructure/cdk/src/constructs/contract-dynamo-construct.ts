import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstructParms } from '../models/contract/contract-dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class ContractDynamoConstruct extends cdk.Construct {
    private contractTable: dynamodb.Table;
    private props: ContractDynamoConstructParms;

    constructor(parent: cdk.Construct, id: string, props: ContractDynamoConstructParms) {
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
         * Add Global Seconday Indexes
         */
        this.addGSI();

        /**
         * Set stackoutputs
         */
        this.setOutputs();
    }

    private createMainTable() {
        this.contractTable = new dynamodb.Table(this, 'dynamodb-table', {
            tableName: `contract-${this.props.shortEnv}`,
            partitionKey: { name: 'contractId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            pointInTimeRecovery: true,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption: this.props.enableEncryptionAtRest
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.DEFAULT,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });
    }

    private addGSI() {
        this.contractTable.addGlobalSecondaryIndex({
            indexName: 'by_sk',
            partitionKey: {
                name: 'sk',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.KEYS_ONLY,
        });
    }

    private setOutputs() {
        new cdk.CfnOutput(this, 'table-name-output', {
            value: this.contractTable.tableName,
            description: 'Contract DynamoDB table name',
        });
        new cdk.CfnOutput(this, 'table-arn-output', {
            value: this.contractTable.tableArn,
            description: 'Contract DynamoDB table Arn',
        });
        new cdk.CfnOutput(this, 'table-streams-arn-output', {
            value: this.contractTable.tableStreamArn!,
            description: 'Contract DynamoDB table Arn',
        });
    }

    getContractTable(): dynamodb.Table {
        return this.contractTable;
    }
}
