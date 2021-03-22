import { postNsn } from '../../src/processor/nsn-routing-create-processor';
import { NsnData } from '../../src/model/nsn-data';
import * as appConfig from '../../src/config';
import * as nock from 'nock';
import { expect } from 'chai';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mock, when, instance } from 'ts-mockito';
import { DynamoDB } from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import * as LambdaTester from 'lambda-tester';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';

describe('Create NSN test suit', () => {
    let mockEvent: APIGatewayProxyEvent = mock(<APIGatewayProxyEvent>{});
    const proxyEvent: APIGatewayProxyEvent = instance(mockEvent);

    it('Null or empty routing ID for create API', async () => {
        when(mockEvent.body).thenReturn(null);

        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        let body: string = '{}';
        when(mockEvent.body).thenReturn(body);
        expect(response.statusCode).to.equal(400);
    });

    it('Invalid routing ID(NaN) for create API', async () => {
        when(mockEvent.body).thenReturn(null);

        let body: string = '{"routing_id": "ab33"}';
        when(mockEvent.body).thenReturn(body);
        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('Invalid routing ID(3 digit number) for create API', async () => {
        when(mockEvent.body).thenReturn(null);

        let body: string = '{"routing_id": "123"}';
        when(mockEvent.body).thenReturn(body);
        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('Invalid routing ID(more than 15 characters) for create API', async () => {
        when(mockEvent.body).thenReturn(null);

        let body: string = '{"routing_id": "1234234gjh323298934"}';
        when(mockEvent.body).thenReturn(body);
        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('NSN record exists error for create API', async () => {
        when(mockEvent.body).thenReturn(null);
        let body: string = '{"routing_id": "1111"}';
        when(mockEvent.body).thenReturn(body);
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
                callback(null, { Item: {} });
            }
        );

        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(422);
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('NSN record success for create API', async () => {
        when(mockEvent.body).thenReturn(null);
        let body: string = '{"routing_id": "1111"}';
        when(mockEvent.body).thenReturn(body);
        AWS.config.update({ region: 'us-east-1' });
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
                callback(null, { Attributes: {} });
            }
        );

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'put',
            (params: DynamoDB.DocumentClient.PutItemInput, callback: Function) => {
                callback(null, { Attributes: {} });
            }
        );

        let response = await postNsn(proxyEvent);
        expect(response.statusCode).to.equal(201);
        AWSMock.restore('DynamoDB.DocumentClient');
    });
});
