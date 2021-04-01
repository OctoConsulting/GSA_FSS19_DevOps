import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { mainProcessor } from './processor/main-processor';

export const handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const mainProcess = async () => {
        console.log('event', event);
        const response = await mainProcessor.start({
            body: event.body!,
        });
        return {
            statusCode: 202,
            body: response,
            isBase64Encoded: false,
        };
    };

    mainProcess()
        .then((result) => {
            callback(null, result);
        })
        .catch((error) => {
            let errorMsg = !error.message ? error : error.message;
            callback(errorMsg);
        });
};
