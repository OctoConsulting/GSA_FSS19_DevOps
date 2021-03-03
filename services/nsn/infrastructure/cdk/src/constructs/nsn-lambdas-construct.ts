import * as cdk from '@aws-cdk/core';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { LambdaFunctions } from '../models/lambda-functions';
import { NsnLambdasConstructParms } from '../models/nsn-lambdas-consruct-props';
import { LambdaConstruct } from './lambda-construct';

export class NsnLambdasConstruct extends cdk.Construct {
    private zipPathInsideModules = 'nodejs/nsn-get-routing/dist/nsn-get-routing/index.zip';
    private props: NsnLambdasConstructParms;
    private lambdaFunctions: LambdaFunctions = {};
    constructor(parent: cdk.Construct, id: string, props: NsnLambdasConstructParms) {
        super(parent, id);
        this.props = props;
        this.postRoutingLambda();
    }

    private postRoutingLambda() {
        const lambdaFun = new LambdaConstruct(this, 'post-nsn-routing-lambda', {
            functionName: `post-nsn-routing-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/${this.zipPathInsideModules}`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
            },
            handler: 'saveNSNData',
            type: LambdaConstructProps.LambdaTypeEnum.NODEJS,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.lambdaFunctions.postRoutingLambda = lambdaFun.lambdaFunction;
        this.props.nsnTable.grantReadData(lambdaFun.lambdaFunction);
    }

    public getLambdaFunctions(): LambdaFunctions {
        return this.lambdaFunctions;
    }
}
