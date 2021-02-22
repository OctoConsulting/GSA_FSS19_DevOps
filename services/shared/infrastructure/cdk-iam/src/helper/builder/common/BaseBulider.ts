import { PolicyStatement } from '@aws-cdk/aws-iam';

export class BaseBuilder {
    protected arnPrefix: string;
    constructor() {}

    getPolicyStatements(): PolicyStatement[] {
        throw new Error('Child class must implient this method');
    }

    getServicePrefix() {
        return this.arnPrefix;
    }

    protected unimplimented(permission: string): PolicyStatement[] {
        throw new Error(`Permission not found for ${permission}`);
    }
}
