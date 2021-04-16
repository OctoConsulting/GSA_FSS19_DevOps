'use strict';

import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { DynamoDB } from 'aws-sdk';
import { checkForExistingNsn } from '../util/nsn-data-util';

export const putNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Updating the NSN data - ' + event);
    if (event.body == null) {
        return apiResponses._400({ message: 'No routing data provided to update NSN routing record.' });
    }

    let { routing_id, owa, is_civ_mgr, is_mil_mgr, ric, changed_by } = JSON.parse(event.body);

    if (!routing_id) {
        return apiResponses._400({ message: 'Routing NSN number is mandatory to update NSN record' });
    }
    routing_id = routing_id.trim();

    if (isNaN(routing_id.substring(0, 4))) {
        return apiResponses._400({ message: 'Please check routing Id restrictions.' });
    }

    if (!(await checkForExistingNsn(routing_id))) {
        return apiResponses._422({ message: 'NSN routing record not found for - ' + routing_id });
    }

    let group_id = Number(routing_id.substring(0, 2));
    let class_id = routing_id.length >= 4 ? Number(routing_id.substring(0, 4)) : 0;

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

    let select_query = 'SELECT * FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routing_id + "'";
    let result: any = await getDBSettings().CONNECTION.promise().query(select_query);
    let existingNsnData: any;

    result.forEach((row: any) => {
        existingNsnData = row ? row[0] : undefined;
    });

    //let existingNsnData = await getDocumentDbClient().get(params);

    if (!existingNsnData) {
        return apiResponses._404({ message: 'No NSN Data found for update for routing_id - ' + routing_id });
    }

    const nsnData: NsnData = {
        routing_id: routing_id.toUpperCase(),
        owa: !owa ? existingNsnData.owa : owa.toUpperCase(),
        is_civ_mgr,
        is_mil_mgr,
        ric: !ric ? existingNsnData.ric : ric.toUpperCase(),
        routing_id_category: existingNsnData.routing_id_category,
        change_date: new Date(),
        changed_by: changed_by,
        create_date: existingNsnData.create_date,
        created_by: existingNsnData.created_by,
    };

    try {
        let update_query =
            'UPDATE ' +
            getDBSettings().TABLE_NAME +
            ' SET owa = ?, is_civ_mgr = ?, is_mil_mgr = ?, ric = ?, change_date = ?, changed_by = ? ' +
            ' WHERE routing_id = ?';
        console.log('Update query - ' + update_query);
        getDBSettings().CONNECTION.getConnection((error, conn) => {
            if (error) {
                console.log('Error while getting connection for updating routing record - ' + error);
            }
            console.log('About to update routing record for id - ' + routing_id);
            conn.query(
                update_query,
                [owa, is_civ_mgr, is_mil_mgr, ric, new Date(), changed_by, routing_id],
                (error, results, fields) => {
                    console.log('Updating records with fields - ' + fields);
                    if (error) {
                        console.log('Error while updating routing record - ' + error);
                    } else {
                        console.log('Update query executed successfully.....');
                    }
                }
            );
            conn.release();
        });
        // getDBSettings().CONNECTION.query(update_query, [
        //     owa,
        //     is_civ_mgr,
        //     is_mil_mgr,
        //     ric,
        //     new Date(),
        //     changed_by,
        //     routing_id,
        // ]);
        console.log(
            'With parameters - ' +
                owa +
                ', is_civ_mgr - ' +
                is_civ_mgr +
                ', is_mil_mgr - ' +
                is_mil_mgr +
                ', ric - ' +
                ric +
                ', changed_by - ' +
                changed_by +
                ', routing_id - ' +
                routing_id
        );
        return apiResponses._200(nsnData);
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
