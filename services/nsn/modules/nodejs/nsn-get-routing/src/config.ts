import { DynamoDB, RDS } from 'aws-sdk';
import mysql2, { Connection } from 'mysql2';

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
        port: 3306,
        username: process.env.DB_USER,
    });

    let token: any = signer.getAuthToken({
        username: process.env.DB_USER,
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
                ? mysql2.createConnection({
                      host: process.env.DB_HOST,
                      user: process.env.DB_USER,
                      password: process.env.DB_PWD,
                      database: process.env.DB_NAME,
                  })
                : mysql2.createConnection({
                      host: process.env.DB_HOST,
                      port: 3306,
                      user: process.env.DB_USER,
                      ssl: { rejectUnauthorized: false },
                      password: token,
                      database: process.env.DB_NAME,
                      authPlugins: {
                          mysql_clear_password: () => () => token,
                      },
                  }),
    };
};

export async function executeUpdate(query: string, values: any | any[] | { [param: string]: any }) {
    let connection: Connection;
    const promise = new Promise(function (resolve, reject) {
        console.log('Starting query ...\n');
        console.log('Running iam auth ...\n');

        if (process.env.SHORT_ENV == 'local') {
            connection = mysql2.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PWD,
                database: process.env.DB_NAME,
            });
        } else {
            var signer = new RDS.Signer({
                region: process.env.AWS_REGION,
                hostname: process.env.DB_HOST,
                port: 3306,
                username: process.env.DB_USER,
            });

            let token = signer.getAuthToken({
                username: process.env.DB_USER,
            });

            console.log('IAM Token obtained' + token);

            let connectionConfig = {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME,
                ssl: { rejectUnauthorized: false },
                password: token,
                authSwitchHandler: (data: any, cb: Function) => {
                    if (data.pluginName === 'mysql_clear_password') {
                        console.log('pluginName: ' + data.pluginName);
                        let password = token + '\0';
                        cb(null, password);
                    }
                },
            };

            connection = mysql2.createConnection(connectionConfig);
        }

        connection.connect(function (err) {
            if (err) {
                console.log('error connecting: ' + err.stack);
                return;
            }

            console.log('connected as id ' + connection.threadId + '\n');
        });

        connection.query(query, values, function (error, results, fields) {
            if (error) {
                //throw error;
                reject({ code: -1, result: null, error: error });
            }

            if (results) {
                console.log('executeDbDMLCommand Query result - ' + results);

                connection.end(function (error: any, results: any) {
                    if (error) {
                        //return "error";
                        reject({ code: -1, result: null, error: error });
                    }
                    // The connection is terminated now
                    console.log('Connection ended\n');

                    resolve({ code: 1, result: results, error: null });
                });
            }
        });
    });
    return promise;
}
