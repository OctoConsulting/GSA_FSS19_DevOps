import { PolicyStatement } from '@aws-cdk/aws-iam';
import { resourcePrefix } from '../resource-helper';
import { BaseBuilder } from './common/BaseBulider';

export class XrayBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string) {
        super();
        this.permission = permission;
    }

    getServicePrefix() {
        return resourcePrefix.getPrefix('xray');
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'xray-read') {
            return this.read();
        }

        return this.unimplimented(this.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['xray:GET*', 'xray:BatchGet*'],
            resources: [`${this.getServicePrefix()}*`],
        });
        return [read];
    }
}
