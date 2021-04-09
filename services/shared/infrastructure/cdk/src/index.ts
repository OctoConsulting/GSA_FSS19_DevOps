#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FssSharedStack } from './fss-shared-stack';
import { FssMiscStack } from './fss-misc-stack';

const app = new cdk.App();

if (!process.env.SHORT_ENV || !process.env.AWS_ACCOUNT || !process.env.AWS_REGION)
    throw Error('must set environment variables. look into README.md');

const { AWS_ACCOUNT, AWS_REGION, SHORT_ENV } = process.env;
const env = { account: AWS_ACCOUNT, region: AWS_REGION };

const fssSharedStack = new FssSharedStack(app, 'fss-shared', { env, stackName: `fss-shared-${SHORT_ENV}` });
cdk.Tags.of(fssSharedStack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(fssSharedStack).add('ApplicationID', 'fss');

const fssMiscStack = new FssMiscStack(app, 'fss-misc', { env, stackName: `fss-misc-${SHORT_ENV}` });
cdk.Tags.of(fssSharedStack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(fssSharedStack).add('ApplicationID', 'fss-misc');
