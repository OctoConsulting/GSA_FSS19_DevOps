'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { dynamoDocumentClient, getSettings } from '../config';
import { apiResponses } from '../model/responseAPI';

export const deleteNsn = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('Getting the NSN data - ' + event.pathParameters);
    if (event.pathParameters === null) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }
    let routingId = event.pathParameters['routingId'];
    if (!routingId) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }

    try {
        var params = {
            TableName: getSettings().TABLE_NAME,
            Key: {
                group_id: parseInt(routingId.substring(0, 2), 10),
                routing_id: routingId,
            },
        };

        console.log('Fetching data from dynamoDB...');
        const nsnData = await dynamoDocumentClient.get(params).promise();
        console.log('Data fetched from DB - ' + nsnData.Item);

        if (nsnData.Item == null) {
            return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
        }
        console.log('About to delete NSN record for routing id - ' + routingId);
        await dynamoDocumentClient.delete(params).promise();
        console.log('NSN record for routing id - ' + routingId);
        return apiResponses._200({ message: 'NSN record for routing id ' + routingId + ' is deleted successfully.' });
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error deleting record for NSN id - ' + routingId });
    }
};
