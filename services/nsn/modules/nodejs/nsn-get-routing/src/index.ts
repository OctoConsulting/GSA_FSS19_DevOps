import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { mainProcessor } from './processor/main-processor';

export const handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const mainProcess = async () => {
        const response = await mainProcessor.start({
            body: event.body!,
        });
        return response;
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
