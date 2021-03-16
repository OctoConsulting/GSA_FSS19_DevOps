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

    const { routing_id, owa, is_civ_mgr, is_mil_mgr, ric, created_by } = JSON.parse(event.body);

    if (!routing_id) {
        return apiResponses._400({ message: 'Routing is mandetory to create NSN record' });
    }
    if (isNaN(routing_id.substring(0, 4))) {
        return apiResponses._400({ message: 'Routing id should be numeric' });
    }
    let group_id = Number(routing_id.substring(0, 2));

    console.log('3 ' + routing_id);
    const params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: group_id,
            routing_id: routing_id,
        },
    };
    debugger;
    console.log('4 - params - ' + params);
    let existingNsnData = await dynamoDocumentClient.get(params).promise();
    console.log('5 existingNsnData - ' + existingNsnData);
    if (existingNsnData.Item != null) {
        return apiResponses._422({ message: 'NSN routing record already exists for the routing id - ' + routing_id });
    }
    console.log('6');

    const nsnData: NsnData = {
        group_id: group_id,
        routing_id,
        owa,
        is_civ_mgr,
        is_mil_mgr,
        ric,
        type: routing_id.length == 2 ? 'group' : routing_id.length == 4 ? 'class' : 'nsn',
        created_by,
        create_date: new Date().getTime().toString(),
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
