import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
export class KmsBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'kms-encrypt') {
            return this.encrypt();
        }
        if (this.permission === 'kms-decrypt') {
            return this.decrypt();
        }
        return this.unimplimented(this.permission);
    }

    private encrypt(): PolicyStatement[] {
        const encrypt = new PolicyStatement({
            actions: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
            resources: [`${this.getServicePrefix()}`],
        });
        return [encrypt];
    }

    private decrypt(): PolicyStatement[] {
        const decrypt = new PolicyStatement({
            actions: ['kms:Decrypt', 'kms:DescribeKey'],
            resources: [`${this.getServicePrefix()}`],
        });
        return [decrypt];
    }
}
