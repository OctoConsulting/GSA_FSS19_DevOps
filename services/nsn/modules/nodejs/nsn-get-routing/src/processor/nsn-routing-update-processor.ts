'use strict';

import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { dynamoDocumentClient, getSettings } from '../config';
import { apiResponses } from '../model/responseAPI';

export const putNsn = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('Updating the NSN data - ' + event);
    if (event.body === null) {
        return apiResponses._400({ message: 'No routing data provided to update NSN routing record.' });
    }

    const { routing_id, owa, is_civ_mgr, is_mil_mgr, ric } = JSON.parse(event.body);

    if (!routing_id) {
        return apiResponses._400({ message: 'Routing NSN number is mandetory to update NSN record' });
    }
    let group_id = routing_id.substring(0, 2);
    console.log('Routing ID - ' + routing_id);
    var params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: group_id,
            routing_id: routing_id,
        },
    };

    console.log('Fetching data from dynamoDB for update...');
    const updateNsnData = await dynamoDocumentClient.get(params).promise();
    console.log('Data fetched from DB  to update - ' + updateNsnData.Item);

    if (updateNsnData.Item == null) {
        return apiResponses._404({ message: 'No NSN Data found for update for routing_id - ' + routing_id });
    }

    const nsnData: NsnData = {
        group_id,
        routing_id,
        owa,
        is_civ_mgr,
        is_mil_mgr,
        ric,
        type: updateNsnData.Item.type,
        create_date: updateNsnData.Item.createDate,
        created_by: updateNsnData.Item.createdBy,
        update_date: new Date().getTime().toString(),
    };

    try {
        const model = { TableName: getSettings().TABLE_NAME, Item: nsnData };
        await dynamoDocumentClient.put(model).promise();
        return apiResponses._200(model);
    } catch (err) {
        console.log('Error while updating - ' + err);
        return apiResponses._500({ message: 'Error updating NSN record for routing ID - ' + routing_id });
    }
};
