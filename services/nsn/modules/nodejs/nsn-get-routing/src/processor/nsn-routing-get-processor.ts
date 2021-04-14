'use strict';
import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { apiResponses } from '../model/responseAPI';
import { getDBSettings } from '../config';
import { checkForExistingNsn } from '../util/nsn-data-util';

export const getNsn = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiResponses._400({ message: 'Routing id is needed to retrieve NSN data' });
    }
    const queryStringParam = event.queryStringParameters;

    let { routing_id, pageNo, pageSize, orderField, desc } = JSON.parse(<string>event.body);

    let routingId = routing_id;

    if (!routingId || routingId.trim().length < 2 || routingId.trim().length == 3) {
        return apiResponses._400({
            message: 'Please enter valid Group , Valid Class or 4 or more characters to find NSNs',
        });
    }

    if (queryStringParam?.validate) {
        if (await checkForExistingNsn(routing_id)) {
            return apiResponses._400({
                message:
                    'This record already exists. Please enter a different NSN, Class or Group Number or <click here> to search existing record.',
            });
        } else {
            return apiResponses._200({ message: 'This routing id is available.' });
        }
    }

    let groupId = Number(routingId?.substring(0, 2));
    console.log('Group id in GET - ' + groupId);

    if (isNaN(groupId)) {
        return apiResponses._400({ message: 'First 2 characters are group id and needs to be numeric' });
    }

    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

    orderField = orderField ? orderField : ' routing_id ';
    pageSize = pageSize ? pageSize : 5;
    let start = pageNo ? pageNo * pageSize : 0;
    let recordCount: number = 0;

    try {
        let query: string =
            'SELECT COUNT(*) AS CNT FROM ' +
            getDBSettings().TABLE_NAME +
            " where routing_id like '" +
            routingId +
            "%'" +
            ' and routing_id_category in ' +
            '( ' +
            (routingId.length == 2 ? "'GROUP'" : "'CLASS'" + ',' + "'NSN'") +
            ' )';

        let result = await getDBSettings().CONNECTION_POOL.query(query);

        result.forEach((row: any) => {
            recordCount = row[0].CNT ? row[0].CNT : recordCount;
        });

        if (!recordCount || recordCount == 0) {
            return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
        }

        let groupQueryStr =
            'SELECT * FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routingId.substring(0, 2) + "'";
        result = await getDBSettings().CONNECTION_POOL.query(groupQueryStr);

        const groupArr = classifyNsnData(result[0], (item: NsnData) => item.routing_id_category);

        let classQueryStr =
            'SELECT * FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routingId.substring(0, 4) + "'";
        result = await getDBSettings().CONNECTION_POOL.query(classQueryStr);
        const classArr = classifyNsnData(result[0], (item: NsnData) => item.routing_id_category);

        // recordCount needs to be adjusted.
        if (routingId.length == 2) {
            // For the group query, need to consider all the class type records for pagination and record count.
            query =
                'SELECT COUNT(*) AS CNT FROM ' +
                getDBSettings().TABLE_NAME +
                " where routing_id like '" +
                routingId +
                "%'" +
                ' and routing_id_category in ' +
                " ('CLASS') ";
            console.log('count query one more time - ' + query);
            let result = await getDBSettings().CONNECTION_POOL.query(query);

            result.forEach((row: any) => {
                recordCount = row[0].CNT ? row[0].CNT : recordCount;
            });
        } else {
            // For the routing id search of 4 characters, ignore the class record from the record count if exists.
            recordCount = routingId.length == 4 && classArr.size == 1 ? recordCount - 1 : recordCount;
        }

        query =
            'SELECT * FROM ' +
            getDBSettings().TABLE_NAME +
            " where routing_id like '" +
            routingId +
            "%'" +
            ' and routing_id_category in ' +
            ' (' +
            (routing_id.length == 2 ? "'CLASS'" : "'NSN'") +
            ') ' +
            ' order by ' +
            orderField +
            (desc && desc.toUpperCase() === 'TRUE' ? ' desc ' : ' asc ') +
            ' limit ' +
            start +
            ' , ' +
            pageSize;

        console.log('main query - ' + query);
        result = await getDBSettings().CONNECTION_POOL.query(query);

        let nsnArr = classifyNsnData(result[0], (item: NsnData) => item.routing_id_category);

        let nsnResponse = {
            group: groupArr.get('GROUP'),
            class: routingId.length == 2 ? (nsnArr ? nsnArr.get('CLASS') : null) : classArr.get('CLASS'),
            nsn: nsnArr ? nsnArr.get('NSN') : null,
            recordCount: recordCount,
        };

        return apiResponses._200(nsnResponse);
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for NSN id - ' + routingId });
    }
};

function classifyNsnData(list: any, keyGetter: any): Map<string, NsnData[]> {
    let classifiedData = new Map<string, []>();
    let nsnArr: any = [];
    list.forEach((item: any) => {
        if (item) {
            const key = keyGetter(item);
            if (classifiedData.has(key)) {
                nsnArr = classifiedData.get(key);
            }
            nsnArr.push(item);
            classifiedData.set(key, nsnArr);
        }
    });
    return classifiedData;
}

module.exports = {
    getNsn,
};
