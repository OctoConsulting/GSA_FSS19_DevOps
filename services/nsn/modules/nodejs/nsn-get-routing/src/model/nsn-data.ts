import { DateTime } from 'aws-sdk/clients/devicefarm';
import { dynamoDocumentClient, getSettings } from '../config';

export interface NsnData {
    group_id?: number;
    routing_id: string;
    owa: string;
    is_civ_mgr: string;
    is_mil_mgr: string;
    ric?: string;
    type?: string;
    update_date?: string;
    updated_by?: string;
    created_by?: string;
    create_date?: string;
}

export async function checkForExistingNsn(routing_id: string) {
    let group_id: number = routing_id ? Number(routing_id.substring(0, 2)) : 0;
    let class_id: number = routing_id && routing_id.length >= 4 ? Number(routing_id.substring(0, 4)) : 0;

    let params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
            group_id: routing_id.length > 4 ? class_id : group_id,
            routing_id: routing_id.toUpperCase(),
        },
    };

    let nsnData = await dynamoDocumentClient.get(params).promise();

    return nsnData.Item ? true : false;
}
