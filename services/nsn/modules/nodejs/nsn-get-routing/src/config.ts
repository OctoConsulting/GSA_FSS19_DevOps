import { DynamoDB, RDS } from 'aws-sdk';
import mysql2, { Connection, Pool } from 'mysql2';

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
export const dynamoDocumentClient = new DynamoDB.DocumentClient(options);

export const getDBSettings = () => {
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
                ? mysql2
                      .createPool({
                          host: process.env.DB_HOST,
                          user: process.env.DB_USER,
                          password: process.env.DB_PWD,
                          database: process.env.DB_NAME,
                      })
                      .promise()
                : mysql2
                      .createConnection({
                          host: process.env.DB_HOST,
                          port: 3306,
                          user: process.env.DB_USER,
                          password: new RDS.Signer().getAuthToken({
                              region: process.env.AWS_REGION,
                              hostname: process.env.DB_HOST,
                              username: process.env.DB_NAME,
                              port: 3306,
                          }),
                          database: process.env.DB_NAME,
                      })
                      .promise(),
    };
};
