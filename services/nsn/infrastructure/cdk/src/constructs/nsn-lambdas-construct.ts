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
        this.lambdaFunctions.postRoutingLambda = this.nsnLambda('post-nsn-routing-lambda', 'index.postNsn');
        this.lambdaFunctions.getRoutingLambda = this.nsnLambda('get-nsn-routing-lambda', 'index.getNsn', false);
        this.lambdaFunctions.putRoutingLambda = this.nsnLambda('put-nsn-routing-lambda', 'index.putNsn');
        this.lambdaFunctions.deleteRoutingLambda = this.nsnLambda('delete-nsn-routing-lambda', 'index.deleteNsn');
    }

    private nsnLambda(name: string, handler: string, writeAccessToDynamo = true) {
        const lambdaFun = new LambdaConstruct(this, `${name}`, {
            functionName: `${name}-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/${this.zipPathInsideModules}`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                TABLE_NAME: this.props.nsnTable.tableName,
            },
            handler: handler,
            type: LambdaConstructProps.LambdaTypeEnum.NODEJS,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });

        writeAccessToDynamo
            ? this.props.nsnTable.grantReadWriteData(lambdaFun.lambdaFunction)
            : this.props.nsnTable.grantReadData(lambdaFun.lambdaFunction);
        return lambdaFun.lambdaFunction;
    }

    public getLambdaFunctions(): LambdaFunctions {
        return this.lambdaFunctions;
    }
}
