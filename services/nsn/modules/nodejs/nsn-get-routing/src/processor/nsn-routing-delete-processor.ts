'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings } from '../config';
import { apiResponses } from '../model/responseAPI';
import { checkForExistingNsn } from '../util/nsn-data-util';
import { Connection } from 'mysql2';

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
        let deleted;
        let connection: Connection = getDBSettings().CONNECTION;
        connection.connect(function (err) {
            if (err) {
                console.log('error connecting in delete: ' + err.stack);
                return;
            }

            console.log('connected in delete as id ' + connection.threadId + '\n');
        });

        connection.query(delete_query, [routingId], (error, results, fields) => {
            console.log('Deleting routing record with fields - ' + fields);
            if (error) {
                console.log('Error while deleting routing record - ' + error);
            } else {
                deleted = true;
                console.log('Delete query executed successfully.....');
            }
        });

        connection.end((error: any, results: any) => {
            if (error) {
                console.log('Error while closing connection after delete- ' + error);
            }
            console.log('Connection ended after delete\n');
        });

        return apiResponses._204({ message: 'NSN record for routing id ' + routingId + ' is deleted successfully!' });
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error deleting record for NSN id - ' + routingId });
    }
};

module.exports = {
    deleteNsn,
};
