'use strict';

import { NsnData, nsnRoutingId } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { dynamoDocumentClient, getSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { DynamoDB } from 'aws-sdk';

export const postNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Saving the NSN data - ' + event);
    if (event.body === null) {
        return apiResponses._400({ message: 'No routing data provided to create NSN routing record.' });
    }
    console.log('1 body - ' + event.body);

    let { routing_id, owa, is_civ_mgr, is_mil_mgr, ric, created_by } = JSON.parse(event.body);
    if (!routing_id) {
        return apiResponses._400({ message: 'Routing is mandatory to create NSN record.' });
    }
    routing_id = routing_id.trim(); // trimming routing id for extra spaces
    if (isNaN(routing_id.substring(0, 4))) {
        return apiResponses._400({ message: 'Please check routing Id restrictions.' });
    }
    if (routing_id.length < 4 && routing_id.length != 2) {
        return apiResponses._400({ message: 'Invalid routing Id, please check routing Id restrictions.' });
    }
    if (routing_id.length > 4 && routing_id.length < 13) {
        return apiResponses._400({ message: 'Invalid routing Id, Please Enter valid Routing ID.' });
    }
    if (routing_id.length > 15) {
        return apiResponses._400({ message: 'Routing id can not be more than 15 characters.' });
    }
    routing_id = routing_id.toUpperCase();
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

    let group_id = Number(routing_id.substring(0, 2));
    // prepend nsn routing id with # to identify the record for nsns routing.
    routing_id = nsnRoutingId(routing_id);

    console.log('3 ' + routing_id);
    const params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: group_id,
            routing_id: routing_id.toUpperCase(),
        },
    };
    console.log('4 - params - ' + JSON.stringify(params, null, 2));
    let existingNsnData = await getDocumentDbClient().get(params).promise();
    console.log('5 existingNsnData - ' + JSON.stringify(existingNsnData, null,2));
    if (existingNsnData.Item != null) {
        return apiResponses._422({ message: 'NSN routing record already exists for the routing id - ' + routing_id });
    }
    console.log('6');

    const nsnData: NsnData = {
        group_id: group_id,
        routing_id: routing_id.toUpperCase(),
        owa: owa.toUpperCase(),
        is_civ_mgr,
        is_mil_mgr,
        ric: !ric?ric:ric.toUpperCase(),
        type: routing_id.length == 2 ? 'group' : routing_id.length == 4 ? 'class' : 'nsn',
        created_by: created_by.toUpperCase(),
        create_date: new Date().getTime().toString(),
        update_date: new Date().getTime().toString(),
    };
    console.log('7');
    try {
        console.log('8');
        const model = { TableName: getSettings().TABLE_NAME, Item: nsnData };
        console.log('9');
        await getDocumentDbClient().put(model).promise();
        console.log('10 ' + model.Item);
        return apiResponses._201(model.Item);
    } catch (err) {
        console.log('Error ---- ' + err);
        return apiResponses._500({ message: 'Error creating NSN record' });
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
    postNsn,
};
