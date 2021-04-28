import * as cdk from '@aws-cdk/core';
import { BatchJobConstructParms } from '../models/batch-job-constructs';
import * as events from '@aws-cdk/aws-events';
import * as eventTargets from '@aws-cdk/aws-events-targets';

export class BatchJobConstruct extends cdk.Construct {
    private props: BatchJobConstructParms;
    constructor(parent: cdk.Construct, id: string, props: BatchJobConstructParms) {
        super(parent, id);
        this.props = props;
        this.lambdaCloudwatchRule();
    }

    lambdaCloudwatchRule() {
        new events.Rule(this, 'Rule', {
            description: `${this.props.description} ${this.props.shortEnv}`,
            ruleName: `${this.props.name}-${this.props.shortEnv}`,
            schedule: events.Schedule.expression(`cron(${this.props.cronExpression})`),
            targets: [new eventTargets.LambdaFunction(this.props.lamdaFunction)],
        });
    }
}
