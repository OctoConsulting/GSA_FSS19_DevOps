'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { AcoOfficeAddressDetailsData } from '../model/aco-office-address-details-data'

export const getContractAcoOfficeAddressDetailsData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiResponses._400({ message: 'INVALID Request : NO request provided' });
    }

    let { d430_aco, d430_rec_type } = JSON.parse(event.body);


    if ( !d430_aco || !d430_rec_type) {
        console.log(' d430_aco : ' + d430_aco + ' | d430_rec_type : ' + d430_rec_type )
        return apiResponses._400({
            message: 'INVALID_REQUEST : Missing required Parameter in Request.',
        });
    }

    try {
        let params = {
            TableName: getSettings().TABLE_NAME,
            Key: {
                pk: d430_aco,
                sk: "detail_d430_"+d430_rec_type.toUpperCase(),
            },
        };
    
        let acoAddressData = await getDocumentDbClient().get(params).promise();
        console.log("ACO Address details : " + JSON.stringify(acoAddressData))

        if (!acoAddressData.Item || acoAddressData.Item.length == 0) {
            return apiResponses._404({ message: 'No ACO Address Details for d430_aco : ' + d430_aco + '| d430_rec_type : ' + d430_rec_type  });
        }

        const acoAddress: AcoOfficeAddressDetailsData = acoAddressData.Item?.details;
        return apiResponses._200(acoAddress);


    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for d430_aco : ' + d430_aco + '| d430_rec_type : ' + d430_rec_type   });
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
    getContractAcoOfficeAddressDetailsData,
};
