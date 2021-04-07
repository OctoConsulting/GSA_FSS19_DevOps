#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EntityManagementApiStack } from './entity-management-api-stack';

const app = new cdk.App();

if (!process.env.SHORT_ENV || !process.env.AWS_ACCOUNT || !process.env.AWS_REGION)
    throw Error('must set environment variables. look into README.md');

const { AWS_ACCOUNT, AWS_REGION, SHORT_ENV } = process.env;
const env = { account: AWS_ACCOUNT, region: AWS_REGION };

/**
 * Entity Management Service
 */
const stack = new EntityManagementApiStack(app, 'entity-management-api', {
    env,
    stackName: `entity-management-api-${SHORT_ENV}`,
});
cdk.Tags.of(stack).add('Env', SHORT_ENV.toUpperCase());
cdk.Tags.of(stack).add('ApplicationID', 'entity-management-api');
