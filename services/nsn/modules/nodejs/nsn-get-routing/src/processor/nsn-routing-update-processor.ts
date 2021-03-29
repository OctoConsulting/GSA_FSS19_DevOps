'use strict';

import { NsnData, nsnRoutingId } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { DynamoDB } from 'aws-sdk';

export const putNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Updating the NSN data - ' + event);
    if (event.body == null) {
        return apiResponses._400({ message: 'No routing data provided to update NSN routing record.' });
    }

    let { routing_id, owa, is_civ_mgr, is_mil_mgr, ric, created_by } = JSON.parse(event.body);

    if (!routing_id) {
        return apiResponses._400({ message: 'Routing NSN number is mandatory to update NSN record' });
    }
    routing_id = routing_id.trim();

    if (isNaN(routing_id.substring(0, 4))) {
        return apiResponses._400({ message: 'Please check routing Id restrictions.' });
    }

    let group_id = Number(routing_id.substring(0, 2));

    console.log('Routing ID - ' + routing_id);
    routing_id = nsnRoutingId(routing_id);
    var params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: group_id,
            routing_id: routing_id,
        },
    };
    let existingNsnData = await getDocumentDbClient().get(params).promise();
    console.log('putNsn flow existingNsnData :: ' + existingNsnData);

    if (existingNsnData.Item == null) {
        return apiResponses._422({ message: 'NSN routing record not found for - ' + routing_id });
    }

   //  let owaRegex = /^[A-X,Z,0-9]$/;
   const owaAllowedVal = ['F', 'M', 'N' , 'P'];
   //  if (!owa || !owaRegex.test(owa)) {
     if (!owaAllowedVal.includes(owa.toUpperCase())) {
         return apiResponses._400({
            message: 'Invalid Commodity Center value. Allowed values are F, P, M, N.',
         });
     }
    // Setting valid values for Civ and Mil Manager
    is_civ_mgr = is_civ_mgr.toUpperCase() == 'Y' ? is_civ_mgr.toUpperCase() : 'N';
    is_mil_mgr = is_mil_mgr.toUpperCase() == 'Y' ? is_mil_mgr.toUpperCase() : 'N';

    if ((is_civ_mgr == 'Y' || is_mil_mgr == 'Y') && !ric) {
        return apiResponses._400({ message: 'Routing identifier code is mandatory.' });
    }

    console.log('Fetching data from dynamoDB for update...');
    const updateNsnData = await getDocumentDbClient().get(params).promise();
    console.log('Data fetched from DB  to update - ' + updateNsnData.Item);

    if (updateNsnData.Item == null) {
        return apiResponses._404({ message: 'No NSN Data found for update for routing_id - ' + routing_id });
    }

    const nsnData: NsnData = {
        group_id: group_id,
        routing_id: routing_id.toUpperCase(),
        owa: owa.toUpperCase(),
        is_civ_mgr,
        is_mil_mgr,
        ric: !ric?ric:ric.toUpperCase(),
        type: updateNsnData.Item.type,
        create_date: updateNsnData.Item.createDate,
        created_by: updateNsnData.Item.createdBy,
        update_date: new Date().getTime().toString(),
    };

    try {
        const model = { TableName: getSettings().TABLE_NAME, Item: nsnData };
        await getDocumentDbClient().put(model).promise();
        return apiResponses._200(model.Item);
    } catch (err) {
        console.log('Error while updating - ' + err);
        return apiResponses._500({ message: 'Error updating NSN record for routing ID - ' + routing_id });
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
    putNsn,
};
