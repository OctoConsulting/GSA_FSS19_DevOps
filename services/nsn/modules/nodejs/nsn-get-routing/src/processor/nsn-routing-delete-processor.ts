'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings, executeDbDMLCommand } from '../config';
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
        executeDbDMLCommand(delete_query, [routingId]);

        return apiResponses._204({ message: 'NSN record for routing id ' + routingId + ' is deleted successfully!' });
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error deleting record for NSN id - ' + routingId });
    }
};

module.exports = {
    deleteNsn,
};
