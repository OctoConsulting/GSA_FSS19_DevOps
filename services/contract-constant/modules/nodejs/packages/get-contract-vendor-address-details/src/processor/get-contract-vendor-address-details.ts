'use strict';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponses, response } from '../model/responseAPI';
import { getSettings } from '../config';
import { VendorAddressDetailsData } from '../model/vendor-address-details-data'

export const getContractVendorAddressDetails = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiResponses._400({ message: 'INVALID Request : NO request provided' });
    }

    let { d430_rpt_off, d430_office, d430_rec_type } = JSON.parse(event.body);


    if (!d430_rpt_off || !d430_office || !d430_rec_type) {
        console.log('d430_rpt_off : ' + d430_rpt_off + ' | d430_office : ' + d430_office + ' | d430_rec_type : ' + d430_rec_type )
        return apiResponses._400({
            message: 'INVALID_REQUEST : Missing required Parameter in Request.',
        });
    }

    try {
        let params = {
            TableName: getSettings().TABLE_NAME,
            Key: {
                pk: d430_rpt_off,
                sk: "detail_d430_"+d430_rec_type.toUpperCase()+"_"+d430_office.toUpperCase(),
            },
        };
    
        let vendorAddressData = await getDocumentDbClient().get(params).promise();
        console.log("Vendor Address details : " + JSON.stringify(vendorAddressData))

        if (!vendorAddressData.Item || vendorAddressData.Item.length == 0) {
            return apiResponses._404({ message: 'No Buyer Data found for d430_rpt_off : ' + d430_rpt_off + ' | d430_office : ' + d430_office + '| d430_rec_type : ' + d430_rec_type  });
        }

        const vendorAddress: VendorAddressDetailsData = vendorAddressData.Item?.details;
        return apiResponses._200(vendorAddress);


    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error fetching record for d430_rpt_off : ' + d430_rpt_off + ' | d430_office : ' + d430_office + '| d430_rec_type : ' + d430_rec_type   });
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
    getContractVendorAddressDetails,
};
