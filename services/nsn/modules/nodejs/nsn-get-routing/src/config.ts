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
    var signer = new RDS.Signer({
        region: process.env.AWS_REGION,
        hostname: process.env.DB_HOST,,
        port: 3306,
        username: process.env.DB_NAME,
      });
    
    let token = signer.getAuthToken({
      username: process.env.DB_NAME
    });

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
                          ssl: { rejectUnauthorized: false },
                          password: token,
                          database: process.env.DB_NAME,
                          authSwitchHandler: function ({pluginName, pluginData}, cb:Function) {
                            console.log("Setting new auth handler.");
                            console.log("pluginName: "+pluginName);
                            if (pluginName === 'mysql_clear_password') {
                                let password = token + '\0';
                                cb(null, password);
                              }


                        }
                          
                      })
                      .promise(),
    };
};
