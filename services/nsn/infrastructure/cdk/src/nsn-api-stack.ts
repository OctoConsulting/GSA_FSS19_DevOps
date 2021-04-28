import * as cdk from '@aws-cdk/core';
import { EnvHelper } from './helper/env-helper';
import { CrossStackImporter } from './helper/CrossStackImporter';
import { EnvParameters } from './models/env-parms';
import { DynamoConstruct } from './constructs/dynamo-construct';
import { ApiGatewayConstruct } from './constructs/api-gateway-construct';
import { constants } from './models/constants';
import { S3Construct } from './constructs/s3-constuct';
import { AllLambdasConstruct } from './constructs/all-lambdas-construct';
import { env } from 'process';
import { BatchJobConstruct } from './constructs/batch-job-construct';
export class NsnApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackContext = this.node.tryGetContext(`${id}-${process.env.SHORT_ENV}`);
        const envParameters: EnvParameters = new EnvHelper().getEnvironmentParams(stackContext);
        console.log('envParameters', envParameters);

        const crossStackImporter = new CrossStackImporter(this, 'corss-stack-imports', envParameters);

        const s3Construct = new S3Construct(this, 'nsn-s3', {
            shortEnv: envParameters.shortEnv,
            name: 'nsn-routing-extract',
        });

        crossStackImporter.getCrossStackImports().rdsDbProps.dbName = envParameters.mysqlDbName;

        const lambdas = new AllLambdasConstruct(this, 'lambdas', {
            shortEnv: envParameters.shortEnv,
            vpc: envParameters.vpc,
            xRayTracing: true,
            artifactBucket: envParameters.artifactsBucket,
            logRetentionInDays: 30,
            sharedArtifactPath: constants.NSN_ROUTING_LAMBDA_ZIP_PATH,
            s3Bucket: s3Construct.myBucket,
            rdsDbProps: crossStackImporter.getCrossStackImports().rdsDbProps,
            lambdaFuns: [
                {
                    name: constants.FUNCTION_NAMES.POST_NSN_ROUTING_LAMBDA,
                    handler: 'index.postNsn',
                    writeAccessToDynamo: true,
                    rdsAccess: true,
                },
                {
                    name: constants.FUNCTION_NAMES.GET_NSN_ROUTING_LAMBDA,
                    handler: 'index.getNsn',
                    rdsAccess: true,
                },
                {
                    name: constants.FUNCTION_NAMES.PUT_NSN_ROUTING_LAMBDA,
                    handler: 'index.putNsn',
                    writeAccessToDynamo: true,
                    rdsAccess: true,
                },
                {
                    name: constants.FUNCTION_NAMES.DELETE_NSN_ROUTING_LAMBDA,
                    handler: 'index.deleteNsn',
                    writeAccessToDynamo: true,
                    rdsAccess: true,
                },
                {
                    artifactPath: constants.NSN_ROUTING_FILE_PROCESSOR_LAMBDA_ZIP_PATH,
                    name: constants.FUNCTION_NAMES.NSN_ROUTING_FILE_PROCESSOR,
                    handler: 'index.handler',
                    writeAccessToS3: true,
                    rdsAccess: true,
                },
            ],
        });

        new BatchJobConstruct(this, 'FileProcessor', {
            cronExpression: '0 1 ? * MON,TUE,WED,THU,FRI *',
            description: 'nsn routing file processor',
            name: 'nsn-routing-file-processor',
            shortEnv: envParameters.shortEnv,
            lamdaFunction: lambdas
                .getLambdaFunctions()
                .filter((x) => x.name === constants.FUNCTION_NAMES.NSN_ROUTING_FILE_PROCESSOR)[0].function,
        });

        new ApiGatewayConstruct(this, 'api', {
            envParameters: envParameters,
            lambdaFunctions: {
                deleteRoutingLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.DELETE_NSN_ROUTING_LAMBDA)[0].function,
                getRoutingLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.GET_NSN_ROUTING_LAMBDA)[0].function,
                postRoutingLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.POST_NSN_ROUTING_LAMBDA)[0].function,
                putRoutingLambda: lambdas
                    .getLambdaFunctions()
                    .filter((x) => x.name === constants.FUNCTION_NAMES.PUT_NSN_ROUTING_LAMBDA)[0].function,
            },
            iVpcEndpoint: crossStackImporter.getCrossStackImports().apiGatewayVpcEndpoint,
        });
    }
}
