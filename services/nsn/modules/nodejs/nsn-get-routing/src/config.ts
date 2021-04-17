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

export const executeDbDMLCommand = (query: string, values: any | any[] | { [param: string]: any }) => {
    console.log('Executing SQL DML command - ' + query);
    console.log('With parameters - ' + values);
    let parameters: string = '';
    values.forEach((param: any) => {
        parameters += param + ', ';
    });
    console.log(' parameters -  ' + parameters);

    var signer = new RDS.Signer({
        region: process.env.AWS_REGION,
        hostname: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
    });

    let token: any = signer.getAuthToken({
        username: process.env.DB_USER,
    });

    const connection: Connection =
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
              });
    connection.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err);
            return;
        }

        console.log('connected as id ' + connection.threadId + '\n');
    });

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log('Error while executeDbDMLCommand routing record - ' + error);
        } else {
            console.log('executeDbDMLCommand query executed successfully.....');
        }
    });
    connection.end((error: any, results: any) => {
        if (error) {
            console.log('Error while closing connection - ' + error);
        }
        console.log('Connection ended\n');
    });
};
