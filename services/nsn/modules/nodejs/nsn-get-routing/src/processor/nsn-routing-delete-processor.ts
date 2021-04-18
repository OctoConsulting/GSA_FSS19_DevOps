'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getDBSettings, executeDbDMLCommand } from '../config';
import { apiResponses } from '../model/responseAPI';
import { checkForExistingNsn } from '../util/nsn-data-util';
import mysql2, { Connection } from 'mysql2';
import { RDS } from 'aws-sdk';

export const deleteNsn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Getting the NSN data - ' + event.pathParameters);
    if (event.pathParameters === null) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }
    let routingId = event.pathParameters['routingId'];
    if (!routingId) {
        return apiResponses._400({ message: 'Routing id is needed to delete NSN data' });
    }

    if (!(await checkForExistingNsn(routingId))) {
        return apiResponses._404({ message: 'No NSN Data found for routingId - ' + routingId });
    }

    try {
        let delete_query = 'DELETE FROM ' + getDBSettings().TABLE_NAME + ' where routing_id = ? ';
        let deleted;
        //executeDbDMLCommand(delete_query, [routingId]);
        var signer = new RDS.Signer({
            region: process.env.AWS_REGION,
            hostname: process.env.DB_HOST,
            port: 3306,
        });

        let token: any = signer.getAuthToken({
            username: process.env.DB_USER,
        });
        console.log('Got token - ' + token);
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
                      //   authPlugins: {
                      //       mysql_clear_password: () => () => token,
                      //   },
                      authSwitchHandler: (data: any, cb: Function) => {
                          if (data.pluginName === 'mysql_clear_password') {
                              console.log('pluginName: ' + data.pluginName);
                              let password = token + '\0';
                              let buffer = Buffer.from(password);
                              cb(null, password);
                          }
                      },
                  });
        console.log('Got connection for delete - ' + connection);
        console.log('About to connect to connection with thread - ' + connection.threadId);
        connection.connect(function (err) {
            if (err) {
                console.log('error connecting: ' + err);
                return;
            }

            console.log('connected as id ' + connection.threadId + '\n');
        });
        console.log('Connection established..... with thread - ' + connection.threadId);
        //connection.execute
        connection.execute(delete_query, [routingId], (error, results, fields) => {
            if (error) {
                console.log('Error while executeDbDMLCommand routing record - ' + error);
            } else {
                console.log('executeDbDMLCommand query executed successfully.....');
            }
            console.log('result on deletion - ' + results);
        });
        console.log('Execution of query done --- ');
        connection.end((error: any, results: any) => {
            if (error) {
                console.log('Error while closing connection - ' + error);
            }
            console.log('Connection ended\n');
        });
        console.log('Connection end done...');

        return apiResponses._204({ message: 'NSN record for routing id ' + routingId + ' is deleted successfully!' });
    } catch (err) {
        console.log('Error >>>>>> ' + err);
        return apiResponses._500({ message: 'Error deleting record for NSN id - ' + routingId });
    }
};

module.exports = {
    deleteNsn,
};
