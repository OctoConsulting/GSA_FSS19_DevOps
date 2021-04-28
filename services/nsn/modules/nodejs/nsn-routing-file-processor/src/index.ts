'use strict';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { apiResponses } from './model/responseAPI';
import AWS, { RDS } from 'aws-sdk';
import mysql2, { Connection } from 'mysql2';

exports.handler = async (): Promise<APIGatewayProxyResult> => {
    let TABLE_NAME: string =
        '`' +
        process.env.DB_NAME +
        '`.' +
        '`nsn_routing' +
        (process.env.SHORT_ENV == undefined ? '' : '_' + process.env.SHORT_ENV) +
        '`';

    let conn: Connection = connection();
    let selectAllSql = 'SELECT * FROM ' + TABLE_NAME;
    // open the file to write with the name as per spec - FSS19_D300P5M1_TS (TS - YYYYMMDD_HHMMSS)
    var moment = require('moment');
    let TS =
        moment().format('YYYY') +
        moment().format('MM') +
        moment().format('DD') +
        '_' +
        moment().format('HH') +
        moment().format('mm') +
        moment().format('ss');
    let dir = '/in-memory-path/';
    let path = 'FSS19_D300P5M1_' + TS;
    console.log('Path - ' + path);

    var MemoryFileSystem = require('memory-fs');
    var fs = new MemoryFileSystem();
    fs.mkdirpSync(dir);

    await conn
        .promise()
        .query(selectAllSql)
        .then((result) => {
            let reportText: string = '';
            if (result[0] && Array.isArray(result[0])) {
                result[0].forEach((item: any) => {
                    reportText += generateReportLine(item);
                });
            }
            fs.writeFileSync(dir + path, reportText);
        });

    AWS.config.update({ region: process.env.AWS_REGION });
    let S3 = new AWS.S3({ apiVersion: '2006-03-01' });
    let s3Response;
    const params = {
        Bucket: 'nsn-routing-extract-902479997164-us-east-1-dev',
        Key: path,
        Body: fs.readFileSync(dir + path),
    };

    await S3.upload(params)
        .promise()
        .then((response: any) => {
            console.log('Routing report uploaded to the S3 bucket successfully.');
            s3Response = response;
        })
        .catch((err: any) => {
            console.log('Error uploading routing report to S3 - ' + err);
            s3Response = err;
        });

    return s3Response
        ? apiResponses._200({ message: 'NSN routing report uploaded to S3 bucket successfully!', data: s3Response })
        : apiResponses._500({ message: 'Internal server error on report generation', data: s3Response });
};

function generateReportLine(item: any): string {
    let line =
        item.routing_id.padEnd(15, ' ') +
        item.owa +
        item.is_civ_mgr +
        item.is_mil_mgr +
        (item.ric ? item.ric.padEnd(3, ' ') : '   ') +
        item.last_change_date;
    line = line.padEnd(45, ' ');
    line += '\n';
    return line.toUpperCase();
}

const connection = function (): Connection {
    let connection: Connection;
    console.log('Starting query ...\n');

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
            return null;
        }

        console.log('connected as id ' + connection.threadId + '\n');
    });
    return connection;
};

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
