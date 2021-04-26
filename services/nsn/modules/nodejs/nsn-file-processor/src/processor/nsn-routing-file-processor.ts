'use strict';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { apiResponses } from '../model/responseAPI';
import {RDS} from 'aws-sdk'
import mysql2, { Connection } from 'mysql2';
import fs from 'fs'


export const generateNsnRoutingReport = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {

    let TABLE_NAME:string =
            '`' +
            process.env.DB_NAME +
            '`.' +
            '`nsn_routing' +
            (process.env.SHORT_ENV == undefined ? '' : '_' + process.env.SHORT_ENV) +
            '`';

    let conn: Connection = connection();
    let selectAllSql = 'SELECT * FROM ' + TABLE_NAME;
    await conn.promise().query(selectAllSql).then((result)=>{
        // open the file to write with the name as per spec - FSS19_D300P5M1_TS (TS - YYYYMMDD_HHMMSS)
        var moment = require('moment');
        let TS = moment().format('YYYY')+moment().format('MM')+moment().format('DD')+'_'+moment().format('HH')+moment().format('mm')+moment().format('ss');
        let path = 'FSS19_D300P5M1_' + TS;
        console.log('Path - '+path);

        let writeStream = fs.createWriteStream(path);
        
        if(result[0] && Array.isArray(result[0])){
            let lineBuffer:Buffer = Buffer.from('');
        result[0].forEach((item: any) => {
            writeStream.write(generateReportLine(item))    
        });
    }
       
    writeStream.on('finish', (err:any)=>{console.log('File created at - '+path+' S3 upload needs to be initiated here and then delete this file.')})
        
        //fs.open()
        // Build the buffer for 1000 records and write to the fileSystem
        // for any error condition, delete the file and return the error response.
        // On successfull complition of creating the file, initiate transfer of the file to S3.
        // Delete the file at the end and return success message with the file name.
    });
    return apiResponses._200({message: 'File created successfully'});
};

function generateReportLine(item:any):string{
    let line = item.routing_id.padEnd(15, ' ')+item.owa+item.is_civ_mgr+item.is_mil_mgr+(item.ric?item.ric.padEnd(3,' '):'   ')+item.last_change_date;
    line = line.padEnd(45, ' ');
    line += '\n';
    return line.toUpperCase();
}


 const connection = function():Connection   {
    let connection: Connection;
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
                return null;
            }

            console.log('connected as id ' + connection.threadId + '\n');
        });
        return connection;
}

module.exports = {
    generateNsnRoutingReport
};
