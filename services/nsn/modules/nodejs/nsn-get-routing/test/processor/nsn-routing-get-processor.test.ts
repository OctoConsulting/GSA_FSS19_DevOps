import { getNsn } from '../../src/processor/nsn-routing-get-processor';
import * as appConfig from '../../src/config';
import * as nock from 'nock';
import { expect } from 'chai';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { mock, when, instance } from 'ts-mockito';
import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import * as LambdaTester from 'lambda-tester';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';

describe('errorTests', () => {
    let mockEvent: APIGatewayProxyEvent = mock(<APIGatewayProxyEvent>{});
    const proxyEvent: APIGatewayProxyEvent = instance(mockEvent);

    it('PathParaneterErrors400', async () => {
        when(mockEvent.pathParameters).thenReturn(null);

        let response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        // invalid routing id parameter
        when(mockEvent.pathParameters).thenReturn({ id: '1' });
        response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        // invalid routing id parameter value
        when(mockEvent.pathParameters).thenReturn({ routingId: '1' });
        response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        // invalid routing id parameter value
        when(mockEvent.pathParameters).thenReturn({ routingId: '123' });
        response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);

        // group id passed as string
        when(mockEvent.pathParameters).thenReturn({ routingId: 'aabb' });
        response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(400);
    });

    it('PathParaneterErrors404', async () => {
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'query',
            (params: DynamoDB.DocumentClient.QueryInput, callback: Function) => {
                callback(null, { Items: [] });
            }
        );

        when(mockEvent.pathParameters).thenReturn({ routingId: '123411111111' });

        let response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(404);
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('GetNsnSuccess200', async () => {
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'query',
            (params: DynamoDB.DocumentClient.QueryInput, callback: Function) => {
                callback(null, { Items: [{ group_id: 12, routing_id: 123411111111 }] });
            }
        );

        when(mockEvent.pathParameters).thenReturn({ routingId: '123411111111' });

        let response = await getNsn(proxyEvent);
        expect(response.statusCode).to.equal(200);
        AWSMock.restore('DynamoDB.DocumentClient');
    });
});
