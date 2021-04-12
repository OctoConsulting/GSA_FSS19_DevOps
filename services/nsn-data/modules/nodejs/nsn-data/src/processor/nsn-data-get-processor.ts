'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { NSNData } from '../model/nsn-data'

export const getNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const queryStringParam = event.queryStringParameters;
    console.log(queryStringParam?.validate);
    if (!event.body) {
        return apiResponses._400({ message: 'NSN is needed to retrieve NSN data' });
    }

    let { nsn_id} = JSON.parse(event.body);

    let nsn = nsn_id;
    
    if (!nsn || nsn.trim().length < 1) {
        return apiResponses._400({
            message: 'Please enter valid NSN.',
        });
    }

    let nifData;
    try {
            let nifParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'PK = :nsn and SK = :nif_details',
                ExpressionAttributeValues: {
                    ':nsn': nsn,
                    ':nif_details': 'nif_details',
                },
            };

            nifData = await getDocumentDbClient().query(nifParams).promise();
            if (!nifData.Items || nifData.Items.length == 0) {
                return apiResponses._404({ message: 'No NIF Data found for NSN - ' + nsn });
            }
            
            const nsnResponse: NSNData = JSON.parse(nifData.Items[0].details);
            nsnResponse.d403_nsn = nsn;
            return apiResponses._200(nsnResponse);
        
        
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for entity id - ' + nsn });
    }
};

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

module.exports = {
    getNSNData,
};
