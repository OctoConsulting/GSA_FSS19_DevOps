'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { NotesDetailsData } from '../model/notes-details-data'

export const getNotesDetailsData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiResponses._400({ message: 'INVALID Request : NO request provided' });
    }

    let { d430_rpt_off ,d430_note_cd, d430_rec_type } = JSON.parse(event.body);


    if ( !d430_rpt_off || !d430_rec_type) {
        console.log(' d430_rpt_off : ' + d430_rpt_off + ' | d430_rec_type : ' + d430_rec_type )
        return apiResponses._400({
            message: 'INVALID_REQUEST : Missing required Parameter in Request.',
        });
    }

    if ( d430_rec_type != 'N') {
        return apiResponses._400({
            message: 'INVALID_REQUEST : Invalid Record type in Request.',
        });
    }

    let notesData ;
    try {
        // let params = {
        //     TableName: getSettings().TABLE_NAME,
        //     Key: {
        //         pk: d430_rpt_off,
        //         sk: "detail_d430_"+d430_rec_type.toUpperCase()+"_"+d430_note_cd,
        //     },
        // };

        const params = {
            TableName: getSettings().TABLE_NAME,
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
            ExpressionAttributeNames:{
              "#pk": "pk",
              "#sk": 'sk'
            },
            ExpressionAttributeValues: {
                ":pk": d430_rpt_off,
                ":sk": 'detail_d430_'+d430_rec_type+'_'+(d430_note_cd?d430_note_cd:'')
            }
          }

        notesData = await getDocumentDbClient().query(params).promise();
    
      //  let notesData = await getDocumentDbClient().get(params).promise();
        console.log("Notes details : " + JSON.stringify(notesData))

        if (!notesData.Items || notesData.Items.length == 0) {
            return apiResponses._404({ message: 'No Notes Details for d430_rpt_off : ' + d430_rpt_off +  ' | d430_note_cd : ' + d430_note_cd +  ' | d430_rec_type : ' + d430_rec_type  });
        }
        let notesResponse : any[] = [];
        notesData.Items.forEach(element => {
            var n = element.sk.lastIndexOf('_');
            var result = element.sk.substring(n + 1);
            element.details.d430_note_cd = result;
            notesResponse.push(element.details)
        });

        console.log("Final Notes details : " + JSON.stringify(notesResponse));
        return apiResponses._200(notesResponse);


    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for d430_rpt_off : ' + d430_rpt_off + ' | d430_note_cd : ' + d430_note_cd + ' | d430_rec_type : ' + d430_rec_type   });
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

module.exports = {
    getNotesDetailsData: getNotesDetailsData,
};
