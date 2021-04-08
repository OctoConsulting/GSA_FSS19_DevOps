import { IVpc, Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { EndpointsConstruct } from './constructs/endpoints-construct';
import { VpcConstruct } from './constructs/vpc-construct';
import { EnvHelper } from './helper/env-helper';
import { EnvParameters } from './models/env-parms';
import { existsSync } from 'fs';
import { CognitoConstruct } from './constructs/cognito-userpool-construct';
import { JenkinsConstruct } from './constructs/jenkins-construct';
import { AuroraMysqlConstruct } from './constructs/aurora-mysql-construct';

export class FssSharedStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext, props!);

        // ===== make sure cdk.context.json is populated first ======
        const myVpc: IVpc = Vpc.fromLookup(this, 'vpc-setup-lookup', {
            vpcId: envParameters.vpcId,
        });
        if (!existsSync('cdk.context.json')) return;
        // ==========================================================

        const vpc = new VpcConstruct(this, 'vpc', {
            envParameters,
            availabilityZones: this.availabilityZones,
            vpc: myVpc,
            stackContext: stackContext,
        });

        new EndpointsConstruct(this, 'endpoints', {
            envParameters,
            vpc: myVpc,
            domainName: envParameters.domainName,
            isolatedSubnets: vpc.getIsolatedLambdaSubnets(),
            route53IsolatedResolverSubnets: vpc.getIsolatedRoute53ResolverSubnets(),
        });

        const cognito = new CognitoConstruct(this, 'cognito', {
            envParameters,
            stackContext,
        });

        new JenkinsConstruct(this, 'jenkins', {
            vpc: myVpc,
            envParameters,
            stackContext,
            ciCdSubnets: vpc.getPrivateCICDSubnets(),
            cognitoUserPoolSecretArn: cognito.getCognitoUserPoolSecretArn(),
        });

        new AuroraMysqlConstruct(this, 'aurora-mysql', {
            shortEnv: envParameters.shortEnv,
            isolatedSubnets: vpc.getIsolatedAuroraSubnets(),
            vpc: myVpc,
            stackContext,
        });
    }
}
