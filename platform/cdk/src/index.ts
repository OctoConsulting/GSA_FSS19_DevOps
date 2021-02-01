#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ContractApiStack } from './contract-api-stack';

const app = new cdk.App();

if (!process.env.SHORT_ENV) throw Error('must set environment variables. look into README.md');

var env = 'dev'; //Default to dev
if (process.env.SHORT_ENV) {
    env = process.env.SHORT_ENV;
}

const contractStack = new ContractApiStack(app, `contract-api-${env}`);
cdk.Tags.of(contractStack).add('Env', env.toUpperCase());
cdk.Tags.of(contractStack).add('ApplicationID', 'contract-api');
