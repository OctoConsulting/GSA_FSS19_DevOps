import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';

export class ApiGatewayBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'apigateway-read') {
            return this.read();
        }

        return this.unimplimented(this.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['apigateway:GET'],
            resources: [`${this.getServicePrefix()}*`],
        });
        return [read];
    }
}
