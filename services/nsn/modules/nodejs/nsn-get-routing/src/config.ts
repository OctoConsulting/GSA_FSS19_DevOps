import { DynamoDB, RDS } from 'aws-sdk';
import mysql from 'mysql';
import mysql2 from 'mysql2';

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
export const dynamoDocumentClient = new DynamoDB.DocumentClient(options);

export const getDBSettings = () => {
    let connectionConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        ssl: 'Amazon RDS',
        authPlugins: {
            mysql_clear_password: () => () => {
                new RDS.Signer().getAuthToken({
                    region: process.env.AWS_REGION,
                    hostname: process.env.DB_HOST,
                    username: process.env.DB_NAME,
                    port: 3306,
                });
            },
        },
    };

    return {
        TABLE_NAME:
            '`' +
            process.env.DB_NAME +
            '`.' +
            '`nsn_routing' +
            (process.env.SHORT_ENV == undefined ? '' : '_' + process.env.SHORT_ENV) +
            '`',
        IS_OFFLINE: process.env.IS_OFFLINE,
        // CONNECTION_POOL:
        //     process.env.SHORT_ENV == 'local'
        //         ? mysql2.createPool({
        //               host: process.env.DB_HOST,
        //               user: process.env.DB_USER,
        //               password: process.env.DB_PWD,
        //               database: process.env.DB_NAME,
        //           })
        //         : mysql2.createConnection(connectionConfig),

        CONNECTION_POOL:
            process.env.SHORT_ENV == 'local'
                ? mysql2
                      .createPool({
                          host: process.env.DB_HOST,
                          user: process.env.DB_USER,
                          password: process.env.DB_PWD,
                          database: process.env.DB_NAME,
                      })
                      .promise()
                : mysql.createConnection(connectionConfig),
    };
};
