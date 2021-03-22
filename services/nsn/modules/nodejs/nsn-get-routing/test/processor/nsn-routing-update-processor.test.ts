import { putNsn } from '../../src/processor/nsn-routing-update-processor';
import { expect } from 'chai';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mock, when, instance } from 'ts-mockito';
import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import * as LambdaTester from 'lambda-tester';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';

describe('Update test suit.', () => {
    let mockEvent: APIGatewayProxyEvent = mock(<APIGatewayProxyEvent>{});
    const proxyEvent: APIGatewayProxyEvent = instance(mockEvent);

    it('Update request with missing request body.', async () => {
        let response = await putNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        when(mockEvent.body).thenReturn('{}');

        response = await putNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('Update request for non existing NSN', async () => {
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
                callback(null, { Item: null });
            }
        );

        let body: string = '{"routing_id": "1111"}';
        when(mockEvent.body).thenReturn(body);

        let response = await putNsn(proxyEvent);
        expect(response.statusCode).to.equal(404);
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('Update request success for NSN', async () => {
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
                callback(null, { Item: {} });
            }
        );

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'put',
            (params: DynamoDB.DocumentClient.PutItemInput, callback: Function) => {
                callback(null, { Attributes: {} });
            }
        );
        when(mockEvent.body).thenReturn('{"routing_id": "1111"}');

        let response = await putNsn(proxyEvent);
        expect(response.statusCode).to.equal(200);
        AWSMock.restore('DynamoDB.DocumentClient');
    });
});

module.exports = {
    putNsn,
};
