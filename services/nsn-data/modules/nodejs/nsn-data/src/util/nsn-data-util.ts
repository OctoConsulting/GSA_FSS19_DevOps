import { dynamoDocumentClient, getSettings } from '../config';
import { DynamoDB } from 'aws-sdk';

export async function checkForExistingNsn(routing_id: string) {
    let group_id: number = routing_id ? Number(routing_id.substring(0, 2)) : 0;
    let class_id: number = routing_id && routing_id.length >= 4 ? Number(routing_id.substring(0, 4)) : 0;

    let params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: routing_id.length > 4 ? class_id : group_id,
            routing_id: routing_id.toUpperCase(),
        },
    };

    let nsnData = await getDocumentDbClient().get(params).promise();

    return nsnData.Item ? true : false;
}

const getDocumentDbClient = (): DynamoDB.DocumentClient => {
    let options = {};

    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    return new DynamoDB.DocumentClient(options);
};
