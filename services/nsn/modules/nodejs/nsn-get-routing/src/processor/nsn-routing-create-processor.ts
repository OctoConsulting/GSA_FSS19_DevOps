import { NsnData } from '../model/nsn-data';
import { DynamoDB } from '../../node_modules/aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient} from "../config"

export const saveNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log('Saving the NSN data - '+event);
    if(event.body === null){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No routing data provided to create NSN routing record.' }),
          };
    }
    
    const { group_id, routing_id, owa, isCivMgr, isMilMgr, ric, createdBy} = JSON.parse(event.body);
    
    if( !group_id){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Group id is mandetory to create NSN record' }),
          };
    }
    const params = {
        TableName: 'nsn_data',
        Key: {
          group_id: group_id,
          routing_id: routing_id
        }
      };
      let existingNsnData = await dynamoDocumentClient.get(params).promise();
      
      if(existingNsnData.Item != null){
        return {
          statusCode: 422,
          body: "NSN routing record already exists for the routing id - "+routing_id
      }; 
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

        const model = {TableName: "nsn_data", Item: nsnData};
        await dynamoDocumentClient.put(model).promise();

        return {
            statusCode: 201,
            body: JSON.stringify(model)
        };
    } catch (err) {
        console.log('Error ---- '+err);
        return {
            statusCode: 500,
            body: JSON.stringify("Error creating NSN record")
        };
    }
}


module.exports = {
    saveNSNData: saveNSNData
}