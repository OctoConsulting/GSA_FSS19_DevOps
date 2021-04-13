'use strict';

import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { DynamoDB } from 'aws-sdk';
import { checkForExistingNsn } from '../util/nsn-data-util';

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
    if (routing_id.length > 14) {
        return apiResponses._400({ message: 'Routing id can not be more than 14 characters.' });
    }
    routing_id = routing_id.toUpperCase();
    //  let owaRegex = /^[A-X,Z,0-9]$/;
    const owaAllowedVal = ['F', 'M', 'N', 'P'];
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
    // check for the class keyed nsn information -- A group_id column can be groupId or classId value
    let classId = routing_id.length >= 4 ? Number(routing_id.substring(0, 4)) : 0;

    if (await checkForExistingNsn(routing_id)) {
        return apiResponses._422({ message: 'NSN routing record already exists for the routing id - ' + routing_id });
    }
    console.log('6');

    let insertQuery =
        'Insert into ' +
        getDBSettings().TABLE_NAME +
        '( routing_id,  owa, is_civ_mgr, is_mil_mgr, ric, routing_id_category, updated_date, created_by, created_date ) ' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    console.log('7');
    let now: Date = new Date();
    try {
        getDBSettings().CONNECTION_POOL.query(insertQuery, [
            routing_id,
            owa,
            is_civ_mgr === 'Y' ? 1 : 0,
            is_mil_mgr === 'Y' ? 1 : 0,
            ric,
            routing_id.length == 2 ? 'GROUP' : routing_id.length == 4 ? 'CLASS' : 'NSN',
            now,
            created_by,
            now,
        ]);

        const nsnData: NsnData = {
            routing_id: routing_id.toUpperCase(),
            owa: owa,
            is_civ_mgr,
            is_mil_mgr,
            ric: ric,
            routing_id_category: routing_id.length == 2 ? 'GROUP' : routing_id.length == 4 ? 'CLASS' : 'NSN',
            updated_date: now,
            created_by: created_by,
            create_date: now,
        };

        return apiResponses._201(nsnData);
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
