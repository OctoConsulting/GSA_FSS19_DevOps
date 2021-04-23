'use strict';
import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { apiResponses } from '../model/responseAPI';
import { getDBSettings, executeQuery } from '../config';
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
    pageNo = (pageNo && Number(pageNo) <= 0) || isNaN(pageNo) ? 1 : pageNo;
    let start = (pageNo - 1) * pageSize;
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

        await executeQuery(query, null)
            .then((response: any) => {
                recordCount = response && response.result && response.result[0] ? response.result[0].CNT : 0;
            })
            .catch((error: any) => {
                console.log('Error while executing query for count - ' + error);
                recordCount = 0;
            });

        if (!recordCount || recordCount == 0) {
            return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
        }

        let groupQueryStr =
            'SELECT * FROM ' + getDBSettings().TABLE_NAME + " where routing_id = '" + routingId.substring(0, 2) + "'";
        console.log('Group query - ' + groupQueryStr);

        let groupArr: any;
        await executeQuery(groupQueryStr, null)
            .then((response: any) => {
                if (response && response.result && response.result[0]) {
                    groupArr = classifyNsnData(response.result, (item: NsnData) => item.routing_id_category);
                }
            })
            .catch((error: any) => {
                console.log('Error while executing group query - ' + error);
                recordCount = 0;
            });

        let classArr: any;

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

            await executeQuery(query, null)
                .then((response: any) => {
                    recordCount = response && response.result && response.result[0] ? response.result[0].CNT : 0;
                })
                .catch((error: any) => {
                    console.log('Error while executing query for count - ' + error);
                    recordCount = 0;
                });

            console.log('record count - ' + recordCount);
        } else {
            let classQueryStr =
                'SELECT * FROM ' +
                getDBSettings().TABLE_NAME +
                " where routing_id = '" +
                routingId.substring(0, 4) +
                "'";
            console.log('Class query - ' + classQueryStr);

            await executeQuery(classQueryStr, null)
                .then((response: any) => {
                    if (response && response.result) {
                        classArr = classifyNsnData(response.result, (item: NsnData) => item.routing_id_category);
                    }
                })
                .catch((error: any) => {
                    console.log('Error while executing class query - ' + error);
                });

            // Ignore the class record from the NSN record count if exists.
            recordCount = routingId.length == 4 && classArr && classArr.size == 1 ? recordCount - 1 : recordCount;
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

        let nsnArr: any;
        await executeQuery(query, null)
            .then((response: any) => {
                if (response && response.result) {
                    nsnArr = classifyNsnData(response.result, (item: NsnData) => item.routing_id_category);
                }
            })
            .catch((error: any) => {
                console.log('Error while executing main query - ' + error);
            });

        let nsnResponse = {
            group: groupArr ? groupArr.get('GROUP') : null,
            class:
                routingId.length == 2 ? (nsnArr ? nsnArr.get('CLASS') : null) : classArr ? classArr.get('CLASS') : null,
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
