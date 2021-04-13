'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { EntiyData } from '../model/entity-data'

export const getEntityData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const queryStringParam = event.queryStringParameters;
    console.log(event.pathParameters ? "EntityId:" + event.pathParameters["entityid"] : "EntityId is Blank");

    if (!event.pathParameters || !event.pathParameters["entityid"]) {
        return apiResponses._400({ message: 'Entity ID is needed to retrieve Entity data' });
    }

    let entityId = event.pathParameters["entityid"];

    if (!entityId || entityId.trim().length < 1) {
        return apiResponses._400({
            message: 'Please enter valid Entity ID.',
        });
    }

    try {
        var entityParams = {
            Key: {
                "pk": entityId,
                "sk": "address"
            },
            TableName: getSettings().TABLE_NAME
        };
        let entityData = await getDocumentDbClient().get(entityParams).promise()
        console.log("Entity Data for entityID : " + entityId + " \n details : " + JSON.stringify(entityData))

        if (!entityData.Item || entityData.Item.length == 0) {
            return apiResponses._404({ message: 'No Entity Data found for entity id - ' + entityId });
        }

        const entityClass: EntiyData = entityData.Item?.details;
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
