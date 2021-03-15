'use strict';
import { NsnData } from '../model/nsn-data';
import { DynamoDB } from '../../node_modules/aws-sdk';
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
    debugger;
    let isGroupSearch: boolean = routingId.length == 2 ? true : false;
    // If the search is for class, then group information also need to be fetched.
    let searchStr = String(groupId);
    let classStr = routingId.length < 4 ? null : routingId.substring(0, 4);

    let nsnData;
    try {
        const params = {
            TableName: getSettings().TABLE_NAME,
            KeyConditionExpression: 'group_id = :group_id and begins_with(routing_id, :routing_id)',
            //This condition may be needed if class information needs to be fetched for a routing id search with string length > 4
            //KeyConditionExpression: 'group_id = :group_id and (begins_with(routing_id, :routing_id) or equals(routing_id, :classStr))',
            ExpressionAttributeValues: {
                ':group_id': groupId,
                ':routing_id': searchStr,
                //This condition may be needed if class information needs to be fetched for a routing id search with string length > 4
                //':routing_id': classStr,
            },
        };

        nsnData = await getDocumentDbClient().query(params).promise();
        console.log('Found items - ' + nsnData.Items);
        if (!nsnData.Items || nsnData.Items.length === 0) {
            return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
        }

        var nsnResponseMap = groupBy(nsnData.Items, (item: NsnData) => item.type, routingId);

        console.log('nsnResponseMap - ' + JSON.stringify(Array.from(nsnResponseMap.entries())));

        return apiResponses._200(Array.from(nsnResponseMap.entries()));
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

function groupBy(list: any, keyGetter: any, searchStr: string) {
    const map = new Map();
    list.forEach((item: any) => {
        let itemRoutingId = item.routing_id;
        if (
            itemRoutingId.length == 2 || // Group info.
            (searchStr.length >= 4 && itemRoutingId === searchStr.substring(0, 4)) || // Matching class info, if search is for class or nsn.
            item.routing_id.startsWith(searchStr) // All matching nsn records for the search string.
        ) {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        }
    });
    if (searchStr.length == 2) {
        map.delete('nsn');
    }
    if (searchStr.length > 4 && !map.has('nsn')) {
        map.clear();
    }
    return map;
}
