#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ContractApiStack } from './contract-api-stack';
import { FssSharedStack } from './fss-shared-stack';

const app = new cdk.App();

if (!process.env.SHORT_ENV || !process.env.AWS_ACCOUNT || !process.env.AWS_REGION)
    throw Error('must set environment variables. look into README.md');

const { AWS_ACCOUNT, AWS_REGION, SHORT_ENV } = process.env;
const env = { account: AWS_ACCOUNT, region: AWS_REGION };

/**
 * Contract API Statck
 */
const contractStack = new ContractApiStack(app, 'contract-api-stack', { env, stackName: `contract-api-${SHORT_ENV}` });
cdk.Tags.of(contractStack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(contractStack).add('ApplicationID', 'contract-api');

/**
 * FSS Shared Stack - TODO - Move to seperate cdk project
 */
const fssSharedStack = new FssSharedStack(app, 'fss-shared-stack', { env, stackName: `fss-shared-${SHORT_ENV}` });
cdk.Tags.of(fssSharedStack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(fssSharedStack).add('ApplicationID', 'fss');
