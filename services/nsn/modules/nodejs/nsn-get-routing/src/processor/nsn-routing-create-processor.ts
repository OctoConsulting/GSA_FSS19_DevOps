'use strict';

import { NsnData } from '../model/nsn-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient, getSettings} from "../config"
import {apiResponses} from '../model/responseAPI'

export const postNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log('Saving the NSN data - '+event);
    if(event.body === null){
        return apiResponses._400({message: 'No routing data provided to create NSN routing record.'});
    }
    
    const { group_id, routing_id, owa, isCivMgr, isMilMgr, ric, createdBy} = JSON.parse(event.body);
    
    if( !group_id){
        return apiResponses._400({message: 'Group id is mandetory to create NSN record'});
    }
    const params = {
        TableName: getSettings().TABLE_NAME,
        Key: {
          group_id: group_id,
          routing_id: routing_id
        }
      };
      let existingNsnData = await dynamoDocumentClient.get(params).promise();
      
      if(existingNsnData.Item != null){
        return apiResponses._422({message: 'NSN routing record already exists for the routing id - '+routing_id});
     }

    const nsnData: NsnData = {
        group_id,
        routing_id,
        owa,
        isCivMgr,
        isMilMgr,
        ric,
        createdBy,
        createDate: new Date().getTime().toString()
    }

    try {

        const model = {TableName: getSettings().TABLE_NAME, Item: nsnData};
        await dynamoDocumentClient.put(model).promise();
        return apiResponses._201(model.Item);
    } catch (err) {
        console.log('Error ---- '+err);
        return apiResponses._500({message: 'Error creating NSN record'});
    }
}


module.exports = {
    postNsn: postNsn
}