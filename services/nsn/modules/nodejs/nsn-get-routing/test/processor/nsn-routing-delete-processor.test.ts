import { deleteNsn } from '../../src/processor/nsn-routing-delete-processor';
import { expect } from 'chai';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mock, when, instance } from 'ts-mockito';
import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import * as LambdaTester from 'lambda-tester';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';

describe('Delete test suit.', () => {
    let mockEvent: APIGatewayProxyEvent = mock(<APIGatewayProxyEvent>{});
    const proxyEvent: APIGatewayProxyEvent = instance(mockEvent);

    it('Delete request with no path parameter.', async () => {
        let response = await deleteNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        when(mockEvent.pathParameters).thenReturn(null);

        response = await deleteNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('Delete request for non existing NSN', async () => {
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
                callback(null, { Item: null });
            }
        );

        when(mockEvent.pathParameters).thenReturn({ routingId: '123411111111' });

        let response = await deleteNsn(proxyEvent);
        expect(response.statusCode).to.equal(404);
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('Delete request success for NSN', async () => {
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
            'delete',
            (params: DynamoDB.DocumentClient.DeleteItemInput, callback: Function) => {
                callback(null, { Attributes: {} });
            }
        );
        when(mockEvent.pathParameters).thenReturn({ routingId: '123411111111' });

        let response = await deleteNsn(proxyEvent);
        expect(response.statusCode).to.equal(204);
        AWSMock.restore('DynamoDB.DocumentClient');
    });
});
