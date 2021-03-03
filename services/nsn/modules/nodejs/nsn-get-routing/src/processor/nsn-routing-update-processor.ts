import { NsnData } from '../model/nsn-data';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient} from "../config"

export const updateNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Updating the NSN data - '+event);
    if(event.body === null){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No routing data provided to update NSN routing record.' }),
          };
    }
    
    const { group_id, routing_id, owa, isCivMgr, isMilMgr, ric, createdBy} = JSON.parse(event.body);
    
    if(!routing_id){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Routing NSN number is mandetory to update NSN record' }),
          };
    }

    console.log("Routing ID - "+routing_id);
      var params = {
        TableName: 'nsn_data',
        Key: {
          routing_id: routing_id
        }
      };

      console.log("Fetching data from dynamoDB for update...")
       const updateNsnData = await dynamoDocumentClient.get(params).promise();
       console.log("Data fetched from DB  to update - "+updateNsnData.Item)

       if(updateNsnData.Item == null){
        return {
            statusCode: 404,
            body: "No NSN Data found for update for routing_id - "+routing_id
          }; 
       }
       console.log("About to delete NSN record for routing id - "+routing_id);
       await dynamoDocumentClient.delete(params);
       console.log("NSN record for routing id - "+routing_id);


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

        const model = {TableName: "nsn_data", Item: updateNsnData};
        await dynamoDocumentClient.put(model).promise();

        return {
            statusCode: 201,
            body: JSON.stringify(model)
        };
    } catch (err) {
        console.log("Error while updating - "+err);
        return {
            statusCode: 500,
            body: JSON.stringify("Error updating NSN record")
        };
    }
}


module.exports = {
    updateNSNData: updateNSNData
}