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

describe('Retrieve NSN test suit', () => {
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

    it('Search by group id', async () => {
        AWSMock.setSDKInstance(AWS);

        mockDocumentClient();

        let searchStr: string;

        searchStr = '12';
        when(mockEvent.pathParameters).thenReturn({ routingId: searchStr });
        let response = await getNsn(proxyEvent);
        validate200Response(response, searchStr);

        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('Search by class id', async () => {
        AWSMock.setSDKInstance(AWS);

        mockDocumentClient();

        let searchStr: string;

        searchStr = '1234';
        when(mockEvent.pathParameters).thenReturn({ routingId: searchStr });
        let response = await getNsn(proxyEvent);
        validate200Response(response, searchStr);

        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('Search by partial NSN id', async () => {
        AWSMock.setSDKInstance(AWS);

        mockDocumentClient();

        let searchStr: string;

        searchStr = '12341';
        when(mockEvent.pathParameters).thenReturn({ routingId: searchStr });
        let response = await getNsn(proxyEvent);
        validate200Response(response, searchStr);

        AWSMock.restore('DynamoDB.DocumentClient');
    });
});

function mockDocumentClient() {
    AWSMock.mock(
        'DynamoDB.DocumentClient',
        'query',
        (params: DynamoDB.DocumentClient.QueryInput, callback: Function) => {
            callback(null, {
                Items: [
                    { group_id: 12, routing_id: '123411111111', type: 'nsn' },
                    { group_id: 12, routing_id: '1234', type: 'class' },
                    { group_id: 12, routing_id: '12', type: 'group' },
                ],
            });
        }
    );
}
function validate200Response(response: any, searchStr: string) {
    expect(response.statusCode).to.equal(200);

    let resObj: any = JSON.parse(response.body);
    if (searchStr.length == 2) {
        expect(resObj.length).to.equal(2);
        expect(resObj[0][0]).to.equal('class');
        expect(resObj[1][0]).to.equal('group');
        expect(resObj[0][1][0].routing_id).to.contains(searchStr);
        expect(resObj[1][1][0].routing_id).to.equal(searchStr);
    } else {
        expect(resObj.length).to.equal(3);
        expect(resObj[0][0]).to.equal('nsn');
        expect(resObj[1][0]).to.equal('class');
        expect(resObj[2][0]).to.equal('group');
        expect(resObj[0][1][0].routing_id).to.contains(searchStr);
        expect(resObj[1][1][0].routing_id).to.equal(searchStr.substring(0, 4));
        expect(resObj[2][1][0].routing_id).to.equal(searchStr.substring(0, 2));
    }
}
