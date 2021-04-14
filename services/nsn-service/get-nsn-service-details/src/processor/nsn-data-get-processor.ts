'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { NSNData } from '../model/nsn-data'

export const getNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let nsnId = event.pathParameters?event.pathParameters["nsnid"]:"";
    if (!nsnId) {
        return apiResponses._400({ message: 'NSN is needed to retrieve NSN data' });
    }
    
    if (!nsnId || nsnId.trim().length < 1) {
        return apiResponses._400({
            message: 'Please enter valid NSN.',
        });
    }

    let nifData;
    try {
            var nifParams = {
                TableName: getSettings().TABLE_NAME,
                Key: {
                    'pk': nsnId,
                    'sk': 'nif_details',
                },
            };

            nifData = await getDocumentDbClient().get(nifParams).promise();
            console.log("JSON" + JSON.stringify(nifData));
            if (!nifData.Item || nifData.Item.length == 0) {
                return apiResponses._404({ message: 'No NIF Data found for NSN - ' + nsnId });
            }
            
            const nsnResponse: NSNData = nifData.Item?.details;
            //nsnResponse.d403_nsn = nsnId;
            return apiResponses._200(nsnResponse);
        
        
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for entity id - ' + nsnId });
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
