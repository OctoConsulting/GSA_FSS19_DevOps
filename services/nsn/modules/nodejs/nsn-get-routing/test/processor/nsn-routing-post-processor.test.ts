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

describe('errorTests', () => {
    let mockEvent: APIGatewayProxyEvent = mock(<APIGatewayProxyEvent>{});
    const proxyEvent: APIGatewayProxyEvent = instance(mockEvent);
    let mockNsnIntfc: NsnData = mock(<NsnData>{});
    var mockNsnData: NsnData = mock(mockNsnIntfc);

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

    it('Invalid routing ID(more than 15 digit number) for create API', async () => {
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

    /*
    
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
    */
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
