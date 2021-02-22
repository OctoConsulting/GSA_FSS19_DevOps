import { PolicyStatement } from '@aws-cdk/aws-iam';
import { resourcePrefix } from '../resource-helper';
import { BaseBuilder } from './common/BaseBulider';

export class ApiGatewayBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string) {
        super();
        this.permission = permission;
    }

    getServicePrefix() {
        return resourcePrefix.getPrefix('apigateway');
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
