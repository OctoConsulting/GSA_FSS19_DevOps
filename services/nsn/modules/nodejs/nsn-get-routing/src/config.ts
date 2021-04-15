import { DynamoDB, RDS } from 'aws-sdk';
import mysql2, { ConnectionOptions } from 'mysql2';

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
export const dynamoDocumentClient = new DynamoDB.DocumentClient(options);

export const getDBSettings = () => {
    var signer = new RDS.Signer({
        region: process.env.AWS_REGION,
        hostname: process.env.DB_HOST,
        username: process.env.DB_NAME,
        port: 3306,
    });

    let token = signer.getAuthToken({
        username: process.env.DB_USER,
    });
    let connectionConfig: ConnectionOptions = {
        connectAttributes: {
            host: [process.env.DB_HOST],
            user: [process.env.DB_USER],
            database: [process.env.DB_NAME],
            ssl: process.env.SHORT_ENV == 'local' ? [] : [{ rejectUnauthorized: false }],
            password: [process.env.SHORT_ENV == 'local' ? process.env.DB_PWD : token],
        },
        authSwitchHandler:
            process.env.SHORT_ENV == 'local'
                ? undefined
                : function ({ pluginName, pluginData }: any, cb: Function) {
                      console.log('Setting new auth handler.');
                  },
    };

    // Adding the mysql_clear_password handler
    if (process.env.SHORT_ENV !== 'local') {
        connectionConfig.authSwitchHandler = (data: any, cb: Function) => {
            console.log('pluginName >>>>>>>>>>>>>>> : ' + data.pluginName);
            console.log('Token >>>>> ' + token);
            if (data.pluginName === 'mysql_clear_password') {
                let password = token + '\0';
                let buffer = Buffer.from(password);
                cb(null, password);
            }
        };
    }

    return {
        TABLE_NAME:
            '`' +
            process.env.DB_NAME +
            '`.' +
            '`nsn_routing' +
            (process.env.SHORT_ENV == undefined ? '' : '_' + process.env.SHORT_ENV) +
            '`',
        IS_OFFLINE: process.env.IS_OFFLINE,
        CONNECTION:
            process.env.SHORT_ENV == 'local'
                ? mysql2.createPool({
                      host: process.env.DB_HOST,
                      user: process.env.DB_USER,
                      password: process.env.DB_PWD,
                      database: process.env.DB_NAME,
                  })
                : mysql2.createConnection(connectionConfig),
    };
};
