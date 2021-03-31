#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NsnApiStack } from './nsn-api-stack';

const app = new cdk.App();

if (!process.env.SHORT_ENV || !process.env.AWS_ACCOUNT || !process.env.AWS_REGION)
    throw Error('must set environment variables. look into README.md');

const { AWS_ACCOUNT, AWS_REGION, SHORT_ENV } = process.env;
const env = { account: AWS_ACCOUNT, region: AWS_REGION };

/**
 * NSN API Statck
 */
const nsnApiStack = new NsnApiStack(app, 'nsn-api', { env, stackName: `nsn-api-${SHORT_ENV}` });
cdk.Tags.of(nsnApiStack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(nsnApiStack).add('ApplicationID', 'nsn-api');
