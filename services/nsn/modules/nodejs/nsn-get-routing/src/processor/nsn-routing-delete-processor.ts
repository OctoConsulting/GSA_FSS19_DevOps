'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { checkForExistingNsn } from '../util/nsn-data-util';

export const deleteNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Getting the NSN data - ' + event.pathParameters);
    if (event.pathParameters === null) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }
    let routingId = event.pathParameters['routingId'];
    if (!routingId) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }

    if (!(await checkForExistingNsn(routingId))) {
        return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
    }

    try {
        let delete_query = 'DELETE FROM ' + getDBSettings().TABLE_NAME + ' where routing_id = ? ';

        getDBSettings().CONNECTION.getConnection(function (error, conn) {
            if (error) {
                console.log('Error while getting connection for deleting` routing record - ' + error);
            }
            console.log('About to delete routing record for id - ' + routingId);
            conn.query(delete_query, [routingId], (error, results, fields) => {
                console.log('Deleting routing record with fields - ' + fields);
                if (error) {
                    console.log('Error while deleting routing record - ' + error);
                } else {
                    console.log('Delete query executed successfully.....');
                }
            });
            conn.release();
        });
        //getDBSettings().CONNECTION.query(delete_query, [routingId]);
        return apiResponses._204({ message: 'NSN record for routing id ' + routingId + ' is deleted successfully!' });
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error deleting record for NSN id - ' + routingId });
    }
};

module.exports = {
    deleteNsn,
};
