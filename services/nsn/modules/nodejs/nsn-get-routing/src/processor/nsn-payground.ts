'use strict';
import { rejects } from 'assert';
import {APIGatewayProxyEvent, AppSyncResolverEvent} from 'aws-lambda'
import { resolve } from 'path';

export function test(event: APIGatewayProxyEvent)  {
    new Promise<boolean>((res, rej) => {
        res(true);
        
      })
        .then(res => {
          console.log(res);
          return false;
        })
        .then(res => {
          console.log(res);
          return true;
        })
          .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log('ERROR:', error.message);
      });
}

module.exports = {
    test: test
}