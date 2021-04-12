import { DynamoDB } from 'aws-sdk';

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
export const dynamoDocumentClient = new DynamoDB.DocumentClient(options);

export let getSettings = () => {
    let tableSuffix = !process.env.SHORT_ENV ? 'dev' : process.env.SHORT_ENV;
    return {
        TABLE_NAME: 'nsn-data-' + tableSuffix,
        IS_OFFLINE: process.env.IS_OFFLINE,
    };
};

export const getDocumentClient = () => {
    return dynamoDocumentClient;
};
