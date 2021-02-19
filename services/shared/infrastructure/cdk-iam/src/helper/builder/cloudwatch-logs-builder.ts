import { PolicyStatement } from '@aws-cdk/aws-iam';
import { resourcePrefix } from '../resource-helper';
import { BaseBuilder } from './common/BaseBulider';

export class CloudwatchLogsBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string) {
        super();
        this.permission = permission;
    }

    getServicePrefix() {
        return resourcePrefix.getPrefix('log-group');
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'logs-read') {
            return this.read();
        }

        return this.unimplimented(this.permission);
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
            resources: [`${this.getServicePrefix()}*`],
        });
        const getLogs = new PolicyStatement({
            actions: [
                'logs:DescribeQueries',
                'logs:GetLogRecord',
                'logs:GetQueryResults',
                'logs:StopQuery',
                'logs:GetLogDelivery',
                'logs:ListLogDeliveries',
            ],
            resources: ['*'],
        });

        return [listLogs, getLogs];
    }
}
