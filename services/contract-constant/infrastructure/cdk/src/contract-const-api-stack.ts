import * as cdk from '@aws-cdk/core';
import { EnvHelper } from './helper/env-helper';
import { CrossStackImporter } from './helper/CrossStackImporter';
import { EnvParameters } from './models/env-parms';
import { DynamoConstruct } from './constructs/dynamo-construct';
import { ApiGatewayConstruct } from './constructs/api-gateway-construct';
import { NsnLambdasConstruct } from './constructs/nsn-lambdas-construct';
import { constants } from './models/constants';
export class ContractConstApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);

        const dynamoDbConstruct = new DynamoConstruct(this, 'dynamo', {
            enableEncryptionAtRest: envParameters.enableEncryptionAtRest,
            shortEnv: envParameters.shortEnv,
            tablePrefix: constants.TABLE_PREFIX,
        });
        const crossStackImporter = new CrossStackImporter(this, 'corss-stack-imports', envParameters);

        // const lambdas = new NsnLambdasConstruct(this, 'lambdas', {
        //     nsnTable: dynamoDbConstruct.getNsnTable(),
        //     shortEnv: envParameters.shortEnv,
        //     vpc: envParameters.vpc,
        //     xRayTracing: true,
        //     artifactBucket: envParameters.artifactsBucket,
        //     artifactKey: constants.NSN_ROUTING_LAMBDA_ZIP_PATH,
        //     logRetentionInDays: 30,
        // });

        // new ApiGatewayConstruct(this, 'api', {
        //     envParameters: envParameters,
        //     lambdaFunctions: {
        //         deleteRoutingLambda: lambdas.getLambdaFunctions().deleteRoutingLambda,
        //         getRoutingLambda: lambdas.getLambdaFunctions().getRoutingLambda,
        //         postRoutingLambda: lambdas.getLambdaFunctions().postRoutingLambda,
        //         putRoutingLambda: lambdas.getLambdaFunctions().putRoutingLambda,
        //     },
        //     iVpcEndpoint: crossStackImporter.getCrossStackImports().apiGatewayVpcEndpoint,
        // });
    }
}
