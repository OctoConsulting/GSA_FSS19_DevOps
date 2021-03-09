import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstructParms } from '../models/contract/contract-dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as kms from '@aws-cdk/aws-kms';
import { constants } from '../models/constants';
export class ContractDynamoConstruct extends cdk.Construct {
    private contractTable: dynamodb.Table;
    private props: ContractDynamoConstructParms;

    private pk_attr_name = 'internal_contract_number';
    private sk_attr_name = 'contract_details_identity';
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
            partitionKey: { name: this.pk_attr_name, type: dynamodb.AttributeType.STRING },
            sortKey: { name: this.sk_attr_name, type: dynamodb.AttributeType.STRING },
            pointInTimeRecovery: true,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption: this.props.enableEncryptionAtRest
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.DEFAULT,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });

        if (this.props.enableEncryptionAtRest) {
            new kms.Alias(this, 'contract-kms-key-alias', {
                aliasName: 'fss19/dynamodb/atrest/contract',
                targetKey: this.contractTable.encryptionKey!,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
        }
    }

    private addGSI() {
        this.contractTable.addGlobalSecondaryIndex({
            indexName: constants.BY_CONTRACT_DETAILS_IDENTITY_GSI_NAME,
            partitionKey: {
                name: this.sk_attr_name,
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
