import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstructParms } from '../models/contract/contract-dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class ContractDynamoConstruct extends cdk.Construct {
    private contractTable: dynamodb.Table;

    constructor(parent: cdk.Construct, id: string, props: ContractDynamoConstructParms) {
        super(parent, id);
        this.createDynamoDbTable(props.envParameters.shortEnv);
    }

    createDynamoDbTable(shortEnv: string) {
        /**
         * Create Table
         */
        this.createMainTable(shortEnv);

        /**
         * Add Global Seconday Indexes
         */
        this.addGSI();

        /**
         * Set stackoutputs
         */
        this.setOutputs();
    }

    createMainTable(shortEnv: string) {
        this.contractTable = new dynamodb.Table(this, 'contract-dynamodb-table', {
            tableName: `contract-${shortEnv}`,
            partitionKey: { name: 'contractId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            pointInTimeRecovery: true,
            encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });
    }

    addGSI() {
        this.contractTable.addGlobalSecondaryIndex({
            indexName: 'by_sk',
            partitionKey: {
                name: 'sk',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.KEYS_ONLY,
        });
    }

    setOutputs() {
        new cdk.CfnOutput(this, 'dynamo-table-name-output', {
            value: this.contractTable.tableName,
            description: 'Contract DynamoDB table name',
        });
        new cdk.CfnOutput(this, 'dynamo-table-arn-output', {
            value: this.contractTable.tableArn,
            description: 'Contract DynamoDB table Arn',
        });
        new cdk.CfnOutput(this, 'dynamo-table-streams-arn-output', {
            value: this.contractTable.tableStreamArn!,
            description: 'Contract DynamoDB table Arn',
        });
    }

    getContractTable(): dynamodb.Table {
        return this.contractTable;
    }
}
