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
        debugger

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