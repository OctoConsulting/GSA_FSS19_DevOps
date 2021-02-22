import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';

export class CloudwatchBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'cloudwatch-read') {
            return this.read();
        }

        return this.unimplimented(this.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
            resources: [`${this.getServicePrefix()}*`],
        });
        return [read];
    }
}
