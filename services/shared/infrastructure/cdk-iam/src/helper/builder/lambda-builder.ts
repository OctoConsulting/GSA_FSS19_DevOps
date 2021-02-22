import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
export class LambdaBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'lambda-read') {
            return this.read();
        }
        return this.unimplimented(this.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['lambda:List*', 'lambda:Get*', 'lambda:GetAccountSettings'],
            resources: [`${this.getServicePrefix()}*`],
        });
        const commonPolicy = new PolicyStatement({
            actions: ['lambda:GetAccountSettings', 'lambda:List*'],
            resources: ['*'],
        });
        return [read, commonPolicy];
    }
}
