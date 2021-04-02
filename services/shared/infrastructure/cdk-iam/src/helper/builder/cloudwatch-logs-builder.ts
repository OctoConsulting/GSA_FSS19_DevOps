import { PolicyStatement } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { BaseBuilder } from './common/BaseBulider';
import { BuilderProps } from '../../models/builder-props';
export class CloudwatchLogsBuilder extends BaseBuilder {
    private permission: string;

    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 'logs-read') {
            return this.read();
        }

        return this.unimplimented(this.props.permission);
    }

    private read(): PolicyStatement[] {
        const listLogs = new PolicyStatement({
            actions: [
                'logs:DescribeLogGroups',
                'logs:DescribeLogStreams',
                'logs:DescribeSubscriptionFilters',
                'logs:StartQuery',
                'logs:FilterLogEvents',
                'logs:GetLogGroupFields',
            ],
            resources: [`${this.getServicePrefix()}`],
        });
        const getLogs = new PolicyStatement({
            actions: [
                'logs:DescribeQueries',
                'logs:GetLogRecord',
                'logs:GetQueryResults',
                'logs:StopQuery',
                'logs:GetLogDelivery',
                'logs:ListLogDeliveries',
                'logs:GetLogEvents',
            ],
            resources: ['*'],
        });

        return [listLogs, getLogs];
    }
}
