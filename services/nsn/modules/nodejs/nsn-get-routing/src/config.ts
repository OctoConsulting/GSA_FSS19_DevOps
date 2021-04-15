import { DynamoDB, RDS } from 'aws-sdk';

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
export const dynamoDocumentClient = new DynamoDB.DocumentClient(options);

export const getDBSettings = () => {
    const mysql = require('mysql2/promise');
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
                ? mysql.createPool({
                      host: process.env.DB_HOST,
                      user: process.env.DB_USER,
                      password: process.env.DB_PWD,
                      database: process.env.DB_NAME,
                  })
                : new RDS.Signer().getAuthToken(
                      {
                          // uses the IAM role access keys to create an authentication token
                          region: process.env.AWS_REGION,
                          hostname: process.env.DB_HOST,
                          username: process.env.DB_NAME,
                          port: 3306,
                      },
                      function (err, token) {
                          if (err) {
                              console.log(`could not get auth token: ${err}`);
                          } else {
                              var connection = mysql.createConnection({
                                  host: process.env.DB_HOST,
                                  port: 3306,
                                  user: process.env.DB_USER,
                                  password: token,
                                  database: process.env.DB_NAME,
                              });
                              connection.connect();
                          }
                      }
                  ),
    };
};
