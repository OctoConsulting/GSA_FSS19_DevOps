'use strict';
import { NsnData } from '../model/nsn-data';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { int } from 'aws-sdk/clients/datapipeline';

export const getNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiResponses._400({ message: 'Routing id is needed to retrieve NSN data' });
    }

    let { routing_id, pageSize, last_routing_id, recCount, desc } = JSON.parse(event.body);

    let routingId = routing_id;
    console.log('routingId in GET - ' + routingId);
    if (!routingId || routingId.trim().length < 2 || routingId.trim().length == 3) {
        return apiResponses._400({
            message: 'Please enter valid Group , Valid Class or 4 or more characters to find NSNs',
        });
    }
    let groupId = Number(routingId?.substring(0, 2));
    console.log('Group id in GET - ' + groupId);
    if (isNaN(groupId)) {
        return apiResponses._400({ message: 'First 2 characters are group id and needs to be numeric' });
    }
    // If the search is for class, then group information also need to be fetched.
    let searchStr = String(groupId);

    let nsnData;

    try {
        if (routingId.length == 2) {
            let groupParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and routing_id = :routing_id',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': routing_id,
                },
            };

            nsnData = await getDocumentDbClient().query(groupParams).promise();
            if (!nsnData.Items || nsnData.Items.length == 0) {
                return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
            }

            const groupArr = classifyNsnData(nsnData.Items, (item: NsnData) => item.routing_id_category, 'group');

            let routinIdMinVal = routingId + '00';
            let routingIdMax = routingId + '99';
            let classParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression:
                    'group_id = :group_id and routing_id between :routing_id_min and :routing_id_max',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id_min': routinIdMinVal,
                    ':routing_id_max': routingIdMax,
                },
                Limit: pageSize ? pageSize : 5,
                ExclusiveStartKey: last_routing_id ? { routing_id: last_routing_id, group_id: groupId } : undefined,
                ScanIndexForward: desc && desc.toUpperCase() === 'TRUE' ? false : true,
            };

            let classNsnData = await getDocumentDbClient().query(classParams).promise();

            // Generate the pagination information only once
            // 1. when there is last evaluated key from the get query above and
            // 2. call to this api is without the paramter of last_routing_id

            let paginationInfo = classNsnData.LastEvaluatedKey
                ? await generatePaginationInfo(classParams, 'class')
                : null;

            if (paginationInfo && paginationInfo.itemCount <= classParams.Limit) {
                classNsnData.LastEvaluatedKey = undefined;
            }

            const classArr = classifyNsnData(classNsnData.Items, (item: NsnData) => item.routing_id_category, 'class');

            let nsnResponse = {
                group: groupArr[0],
                class: classArr && classArr.length > 0 ? classArr : null,
                paginationInfo: paginationInfo && paginationInfo.itemCount > classParams.Limit ? paginationInfo : null,
                recordCount: paginationInfo && paginationInfo.itemCount ? paginationInfo.itemCount : 0,
                last_routing_id: classNsnData.LastEvaluatedKey ? classNsnData.LastEvaluatedKey.routing_id : null,
            };

            return apiResponses._200(nsnResponse);
        } else {
            let classId = Number(routingId.substring(0, 4));
            // Fetch nsn data
            let nsnParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :class_id and begins_with(routing_id, :routing_id) ',
                ExpressionAttributeValues: {
                    ':class_id': classId,
                    ':routing_id': routing_id,
                },

                Limit: pageSize ? pageSize : 5,
                ExclusiveStartKey: last_routing_id ? { routing_id: last_routing_id, group_id: classId } : undefined,
                ScanIndexForward: desc && desc.toUpperCase() === 'TRUE' ? false : true,
            };

            nsnData = await getDocumentDbClient().query(nsnParams).promise();

            // Generate the pagination information only once
            // 1. when there is last evaluated key from the get query above and
            // 2. call to this api is without the paramter of last_routing_id
            let paginationInfo = nsnData.LastEvaluatedKey ? await generatePaginationInfo(nsnParams, 'nsn') : null;

            if (paginationInfo && paginationInfo.itemCount <= nsnParams.Limit) {
                nsnData.LastEvaluatedKey = undefined;
            }
            let nsnArr = classifyNsnData(nsnData.Items, (item: NsnData) => item.routing_id_category, 'nsn');

            // Fetch class data
            let classStr = routingId.substring(0, 4);
            let classParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  routing_id = :routing_id ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': classStr,
                },
            };
            let classNsnData = await getDocumentDbClient().query(classParams).promise();
            const classArr = classifyNsnData(classNsnData.Items, (item: NsnData) => item.routing_id_category, 'class');

            if (routingId.length == 4 && (!classArr || classArr.length == 0) && (!nsnArr || nsnArr.length == 0)) {
                return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
            }

            // Fetch group data
            let groupParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  routing_id = :routing_id ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': searchStr,
                },
            };

            let groupNsnData = await getDocumentDbClient().query(groupParams).promise();
            const groupArr = classifyNsnData(groupNsnData.Items, (item: NsnData) => item.routing_id_category, 'group');

            let nsnResponse = {
                group: groupArr && groupArr.length > 0 ? groupArr[0] : null,
                class: classArr && classArr.length > 0 ? classArr : null,
                nsn: nsnArr && nsnArr.length > 0 ? nsnArr : null,
                paginationInfo: paginationInfo && paginationInfo.itemCount > nsnParams.Limit ? paginationInfo : null,
                recordCount:
                    paginationInfo && paginationInfo.itemCount
                        ? paginationInfo.itemCount
                        : classArr.length > 0
                        ? classArr.length
                        : 0,
                last_routing_id: nsnData.LastEvaluatedKey ? nsnData.LastEvaluatedKey.routing_id : null,
            };
            return apiResponses._200(nsnResponse);
        }
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for NSN id - ' + routingId });
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

async function generatePaginationInfo(queryParams: any, searchType: string) {
    let pageIndexInfo: Array<object> = [];
    let itemCount: number = 0;

    // Build the pagination ind=formation for the page
    let cnt: int = 1;
    let paginationParams = {
        TableName: getSettings().TABLE_NAME,
        KeyConditionExpression: queryParams.KeyConditionExpression,
        ExpressionAttributeValues: queryParams.ExpressionAttributeValues,
        Limit: queryParams.Limit,
        ExclusiveStartKey: queryParams.ExclusiveStart,
        ScanIndexForward: queryParams.ScanIndexForward,
    };
    let next: boolean = false;
    do {
        let tmpResultForPagination = await getDocumentDbClient().query(paginationParams).promise();
        next = tmpResultForPagination.LastEvaluatedKey ? true : false;
        itemCount += tmpResultForPagination.Items ? tmpResultForPagination.Items.length : 0;
        console.log('tmpResultForPagination.LastEvaluatedKey - ' + tmpResultForPagination.LastEvaluatedKey);

        if (tmpResultForPagination.LastEvaluatedKey) {
            let routingId = tmpResultForPagination.LastEvaluatedKey.routing_id
                ? tmpResultForPagination.LastEvaluatedKey.routing_id
                : null;

            console.log('routingId inside paginationInfo - ' + routingId);

            pageIndexInfo.push({
                page: ++cnt,
                last_routing_id: routingId,
            });

            paginationParams.ExclusiveStartKey = {
                routing_id: routingId,
                group_id: routingId.length > 4 ? Number(routingId.substring(0, 4)) : Number(routingId.substring(0, 2)),
            };
        }
    } while (next);
    return { pageIndexInfo, itemCount };
}

function classifyNsnData(list: any, keyGetter: any, searchStr: string): NsnData[] {
    let classifiedData: NsnData[] = [];

    list.forEach((item: any) => {
        const key = keyGetter(item);
        if (key === searchStr) {
            let itemRoutingId = item.routing_id;
            item.routing_id =
                itemRoutingId && itemRoutingId.startsWith('#')
                    ? itemRoutingId.substring(1, itemRoutingId.length)
                    : itemRoutingId;
            classifiedData.push(item);
        }
    });
    console.log('Got classified data for search string: ' + searchStr + ' - ' + classifiedData);
    return classifiedData;
}

module.exports = {
    getNsn,
};
