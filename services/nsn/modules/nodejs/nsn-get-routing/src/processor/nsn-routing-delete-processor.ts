import { NsnData } from '../model/nsn-data';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient} from "../config"

export const deleteNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Getting the NSN data - '+event.pathParameters);
    if(event.pathParameters === null){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Routing id is needed to delete NSN data' }),
          };
    }
    let routingId = event.pathParameters['id'];
    console.log("Routing ID - "+routingId);
    try {

      var params = {
        TableName: 'nsn_data',
        Key: {
          routingId: routingId
        }
      };

      console.log("Fetching data from dynamoDB...")
       const nsnData = await dynamoDocumentClient.get(params).promise();
       console.log("Data fetched from DB - "+nsnData.Item)

       if(nsnData.Item == null){
        return {
            statusCode: 404,
            body: "No NSN Data found for routingId - "+routingId
          }; 
       }
       console.log("About to delete NSN record for routing id - "+routingId);
       await dynamoDocumentClient.delete(params);
       console.log("NSN record for routing id - "+routingId);

        return {
            statusCode: 200,
            body: JSON.stringify("NSN record for routing id "+routingId+" is deleted successfully.")
        };
    } catch (err) {
      console.log("Error >>>>>> "+err)
        return {
            statusCode: 500,
            body: JSON.stringify("Error fetching record for NSN id - "+routingId)
        };
    }
}


module.exports = {
  deleteNSNData: deleteNSNData
}