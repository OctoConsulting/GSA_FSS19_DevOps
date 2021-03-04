import { NsnData } from '../model/nsn-data';
import { DynamoDB } from '../../node_modules/aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {dynamoDocumentClient} from "../config"
import {error, success, validation} from "../model/responseAPI"

export const retrieveNSNData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Getting the NSN data - '+event.pathParameters);
    if(event.pathParameters === null){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Routing id is needed to retrieve NSN data' }),
          };
    }

    let routingId = event.pathParameters['id'];
    console.log("routingId in GET - "+routingId);
    if(!routingId || routingId.trim().length < 2 || routingId.trim().length == 3){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Please enter valid Group , Valid Class or 4 or more characters to find NSNs ' }),
      };
    }
    let groupId = Number(routingId?.substring(0, 2));
    console.log("Group id in GET - "+groupId);
    if(isNaN(groupId)){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'First 2 characters are group id and needs to be numeric' }),
      };
    }

    let nsnData;
    try {
        if(routingId.length == 2){
          console.log("Fetching NSN data by group id - "+routingId);
        const params = {
            TableName: 'nsn_data',
            Key: {
              group_id: groupId,
              routing_id: routingId
            }
          };
          nsnData = await dynamoDocumentClient.get(params).promise();
          console.log("Fetched NSN data by group ID - "+JSON.stringify(nsnData.Item));
          if(nsnData.Item == null){
            return {
              statusCode: 404,
              body: "No NSN Data found for routingId - "+routingId
          }; 
         }
  
        return {
            statusCode: 200,
            body: JSON.stringify(nsnData.Item)
        };

        }else{
          const params = {
              TableName: 'nsn_data',
              KeyConditionExpression: 'group_id = :group_id and begins_with(routing_id, :routing_id)',
              ExpressionAttributeValues: {
                ":group_id": groupId,
                ":routing_id": routingId
              }
            };


            nsnData = await dynamoDocumentClient.query(params).promise();
            console.log("Found items - "+nsnData.Items);
            if(!nsnData.Items || nsnData.Items.length === 0){
              return {
                statusCode: 404,
                body: "No NSN Data found for routingId - "+routingId
            } 
          };
          return {
            statusCode: 200,
            body: JSON.stringify(nsnData.Items)
        };
          
        }
    } catch (err) {
      console.log("Error >>>>>> "+err)
        return {
            statusCode: 500,
            body: JSON.stringify("Error fetching record for NSN id - "+routingId)
        };
    }
  
}


module.exports = {
  retrieveNSNData: retrieveNSNData
}