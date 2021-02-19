import { PolicyStatement } from '@aws-cdk/aws-iam';

export class BaseBuilder {
    constructor() {}

    getPolicyStatements(): PolicyStatement[] {
        throw new Error('Child class must implient this method');
    }

    getServicePrefix() {
        throw new Error('Child class must implient this method');
    }

    protected unimplimented(permission: string): PolicyStatement[] {
        throw new Error(`Permission not found for ${permission}`);
    }
}
