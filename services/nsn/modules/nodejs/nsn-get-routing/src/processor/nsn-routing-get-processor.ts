'use strict';
import { NsnData } from '../model/nsn-data';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';

export const getNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.pathParameters) {
        return apiResponses._400({ message: 'Routing id is needed to retrieve NSN data' });
    }
    let routingId = event.pathParameters['routingId'];

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
    debugger;

    try {
        if (routingId.length == 2) {
            const groupParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  routing_id = :routing_id ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': searchStr,
                },
            };

            nsnData = await getDocumentDbClient().query(groupParams).promise();

            const groupArr = classifyNsnData(nsnData.Items, (item: NsnData) => item.type, 'group');

            if (!groupArr || groupArr.length == 0) {
                return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
            }

            let routinIdMinVal = routingId + '00';
            let routingIdMax = routingId + '99';
            const params = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression:
                    'group_id = :group_id and routing_id between :routing_id_min and :routing_id_max',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id_min': routinIdMinVal,
                    ':routing_id_max': routingIdMax,
                },
            };

            nsnData = await getDocumentDbClient().query(params).promise();

            const classArr = classifyNsnData(nsnData.Items, (item: NsnData) => item.type, 'class');

            let nsnResponse = {
                group: groupArr[0],
                class: classArr && classArr.length > 0 ? classArr : null,
            };
            return apiResponses._200(nsnResponse);
        } else {
            // Fetch nsn data
            const nsnParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  begins_with(routing_id, :routing_id) ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': routingId,
                },
            };
            nsnData = await getDocumentDbClient().query(nsnParams).promise();

            let nsnArr = classifyNsnData(nsnData.Items, (item: NsnData) => item.type, 'nsn');

            // Fetch class data
            let classStr = routingId.substring(0, 4);
            const classParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  routing_id = :routing_id ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': classStr,
                },
            };
            let classNsnData = await getDocumentDbClient().query(classParams).promise();
            const classArr = classifyNsnData(classNsnData.Items, (item: NsnData) => item.type, 'class');

            if (
                (routingId.length > 4 && (!nsnArr || nsnArr.length == 0)) ||
                (routingId.length == 4 && (!classArr || classArr.length == 0))
            ) {
                return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
            }

            // Fetch group data
            const groupParams = {
                TableName: getSettings().TABLE_NAME,
                KeyConditionExpression: 'group_id = :group_id and  routing_id = :routing_id ',
                ExpressionAttributeValues: {
                    ':group_id': groupId,
                    ':routing_id': searchStr,
                },
            };

            let groupNsnData = await getDocumentDbClient().query(groupParams).promise();
            const groupArr = classifyNsnData(groupNsnData.Items, (item: NsnData) => item.type, 'group');

            let nsnResponse = {
                group: groupArr && groupArr.length > 0 ? groupArr[0] : null,
                class: classArr && classArr.length > 0 ? classArr : null,
                nsn: nsnArr && nsnArr.length > 0 ? nsnArr : null,
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

function classifyNsnData(list: any, keyGetter: any, searchStr: string): NsnData[] {
    let classifiedData: NsnData[] = [];

    list.forEach((item: any) => {
        let itemRoutingId = item.routing_id;
        const key = keyGetter(item);
        if (key === searchStr) {
            classifiedData.push(item);
        }
    });
    console.log('Got classified data for search string: ' + searchStr + ' - ' + classifiedData);
    return classifiedData;
}

module.exports = {
    getNsn,
};
