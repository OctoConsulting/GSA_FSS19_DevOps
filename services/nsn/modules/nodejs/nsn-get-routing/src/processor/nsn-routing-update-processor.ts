'use strict';

import { NsnData } from '../model/nsn-data';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient} from "../config"
import {apiResponses} from '../model/responseAPI'

export const updateNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Updating the NSN data - '+event);
    if(event.body === null){
        return apiResponses._400({ message: 'No routing data provided to update NSN routing record.' });
    }
    
    const { group_id, routing_id, owa, isCivMgr, isMilMgr, ric} = JSON.parse(event.body);
    
    if(!routing_id){
        return apiResponses._400({ message: 'Routing NSN number is mandetory to update NSN record' });
    }

    console.log("Routing ID - "+routing_id);
      var params = {
        TableName: 'nsn_data',
        Key: {
            group_id: group_id,
            routing_id: routing_id
          }
      };

      console.log("Fetching data from dynamoDB for update...")
       const updateNsnData = await dynamoDocumentClient.get(params).promise();
       console.log("Data fetched from DB  to update - "+updateNsnData.Item)

       if(updateNsnData.Item == null){
        return apiResponses._404({ message: 'No NSN Data found for update for routing_id - '+routing_id });
       }


       const nsnData: NsnData = {
        group_id,
        routing_id,
        owa,
        isCivMgr,
        isMilMgr,
        ric
    }

    try {

        const model = {TableName: "nsn_data", Item: nsnData};
        await dynamoDocumentClient.put(model).promise();
        return apiResponses._200(model);
    } catch (err) {
        console.log("Error while updating - "+err);
        return apiResponses._500({message: 'Error updating NSN record for routing ID - '+routing_id});
    }
}


module.exports = {
    updateNSNData: updateNSNData
}