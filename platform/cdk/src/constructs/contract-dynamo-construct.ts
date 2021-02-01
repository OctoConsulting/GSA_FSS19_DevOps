import * as cdk from '@aws-cdk/core';
import { ContractDynamoConstructParms } from '../models/contract/contract-dynamo-construct-parms';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class ContractDynamoConstruct extends cdk.Construct {
    constructor(parent: cdk.Construct, id: string, props: ContractDynamoConstructParms) {
        super(parent, id);
        this.createDynamoDbTable(props.envParameters.shortEnv);
    }

    createDynamoDbTable(shortEnv: string) {
        const table = new dynamodb.Table(this, 'contract-dynamodb-table', {
            tableName: `contract-${shortEnv}`,
            partitionKey: { name: 'contractId', type: dynamodb.AttributeType.STRING },
        });
    }
}
