'use strict';

import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { dynamoDocumentClient, getSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { RSA_PSS_SALTLEN_MAX_SIGN } from 'constants';

export const postNsn = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('Saving the NSN data - ' + event);
    if (event.body === null) {
        return apiResponses._400({ message: 'No routing data provided to create NSN routing record.' });
    }
    console.log('1 body - ' + event.body);

    const { group_id, routing_id, owa, isCivMgr, isMilMgr, ric, createdBy } = JSON.parse(event.body);
    console.log('2 - ' + group_id);
    if (!group_id) {
        return apiResponses._400({ message: 'Group id is mandetory to create NSN record' });
    }
    console.log('3 ' + routing_id);
    const params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: group_id,
            routing_id: routing_id,
        },
    };
    console.log('4 - params - ' + params);
    let existingNsnData = await dynamoDocumentClient.get(params).promise();
    console.log('5 existingNsnData - ' + existingNsnData);
    if (existingNsnData.Item != null) {
        return apiResponses._422({ message: 'NSN routing record already exists for the routing id - ' + routing_id });
    }
    console.log('6');

    const nsnData: NsnData = {
        group_id,
        routing_id,
        owa,
        isCivMgr,
        isMilMgr,
        ric,
        createdBy,
        createDate: new Date().getTime().toString(),
    };
    console.log('7');
    try {
        console.log('8');
        const model = { TableName: getSettings().TABLE_NAME, Item: nsnData };
        console.log('9');
        await dynamoDocumentClient.put(model).promise();
        console.log('10 ' + model.Item);
        return apiResponses._201(model.Item);
    } catch (err) {
        console.log('Error ---- ' + err);
        return apiResponses._500({ message: 'Error creating NSN record' });
    }
};
