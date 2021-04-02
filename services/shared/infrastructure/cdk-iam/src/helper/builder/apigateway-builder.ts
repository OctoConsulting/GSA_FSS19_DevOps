import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';
import * as cdk from '@aws-cdk/core';
import { BuilderProps } from '../../models/builder-props';
export class ApiGatewayBuilder extends BaseBuilder {
    constructor(parent: cdk.Construct, id: string, props: BuilderProps) {
        super(parent, id, props);
    }

    public buildPolicyStatements(): PolicyStatement[] {
        if (this.props.permission === 'apigateway-read') {
            return this.read();
        }
        if (this.props.permission === 'apigateway-runapi') {
            return this.runapi();
        }

        return this.unimplimented(this.props.permission);
    }

    private read(): PolicyStatement[] {
        const read = new PolicyStatement({
            actions: ['apigateway:GET'],
            resources: [`${this.getServicePrefix('*', '')}`],
        });
        return [read];
    }

    private runapi(): PolicyStatement[] {
        const runapi = new PolicyStatement({
            actions: ['apigateway:PUT', 'apigateway:POST'],
            resources: [`${this.getServicePrefix('*', '')}`],
        });
        return [runapi];
    }
}
