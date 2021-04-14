import * as cdk from '@aws-cdk/core';
import { AuroraMysqlConstruct } from './constructs/aurora-mysql-construct';
import { FssDatabaseStackProps } from './models/fss-database-stack-props';
import { constants } from './models/constants';
import { existsSync } from 'fs';

export class FssDatabaseStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: FssDatabaseStackProps) {
        super(scope, id, props);

        // ===== make sure cdk.context.json is populated first ======
        if (!existsSync('cdk.context.json')) return;

        const stackContext = {
            ...this.node.tryGetContext(`${constants.COMMON_STACK}-${process.env.SHORT_ENV}`),
            ...this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`),
        };

        new AuroraMysqlConstruct(this, 'aurora-mysql', {
            shortEnv: process.env.SHORT_ENV!,
            vpc: props!.vpc,
            stackContext,
            account: process.env.AWS_ACCOUNT!,
        });
    }
}
