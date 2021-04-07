import * as cdk from '@aws-cdk/core';
import { DynamoConstructParms } from '../models/dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as kms from '@aws-cdk/aws-kms';

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
        this.nsnTable = new dynamodb.Table(this, 'table', {
            tableName: `${this.props.tablePrefix}-data-${this.props.shortEnv}`,
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            pointInTimeRecovery: true,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption: this.props.enableEncryptionAtRest
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.DEFAULT,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });

        if (this.props.enableEncryptionAtRest) {
            new kms.Alias(this, `${this.props.tablePrefix}-kms-key-alias`, {
                aliasName: `fss19/dynamodb/atrest/${this.props.tablePrefix.replace('-', '')}`,
                targetKey: this.nsnTable.encryptionKey!,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
        }
    }

    private setOutputs() {
        new cdk.CfnOutput(this, 'table-name-output', {
            value: this.nsnTable.tableName,
            description: `${this.props.tablePrefix} DynamoDB table name`,
        });
        new cdk.CfnOutput(this, 'table-arn-output', {
            value: this.nsnTable.tableArn,
            description: `${this.props.tablePrefix} DynamoDB table Arn`,
        });
        new cdk.CfnOutput(this, 'table-streams-arn-output', {
            value: this.nsnTable.tableStreamArn!,
            description: `${this.props.tablePrefix} DynamoDB table Arn`,
        });
    }

    getNsnTable(): dynamodb.Table {
        return this.nsnTable;
    }
}
