'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { EntiyData } from '../model/entity-data'

export const getEntityData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const queryStringParam = event.queryStringParameters;
    console.log(queryStringParam?.validate);
    if (!event.body) {
        return apiResponses._400({ message: 'Entity ID is needed to retrieve Entity data' });
    }

    let { entity_id} = JSON.parse(event.body);

    let entityId = entity_id;
    
    if (!entityId || entityId.trim().length < 1) {
        return apiResponses._400({
            message: 'Please enter valid Entity ID.',
        });
    }

    let entityData;
    let entityResponse : EntiyData[]=[];
    try {
            let entityParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'PK = :entityId and SK = :address',
                ExpressionAttributeValues: {
                    ':entityId': entityId,
                    ':address': 'address',
                },
            };

            entityData = await getDocumentDbClient().query(entityParams).promise();
            if (!entityData.Items || entityData.Items.length == 0) {
                return apiResponses._404({ message: 'No Entity Data found for entity id - ' + entityId });
            }
            
            const entityClass: EntiyData = JSON.parse(entityData.Items[0].details);
            return apiResponses._200(entityClass);
        
        
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for entity id - ' + entityId });
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
    getEntityData,
};