import * as cdk from '@aws-cdk/core';
import { ContractLambdasConstructParms } from '../models/contract/contract-lambdas-consruct-props';
import { LambdaConstruct } from './shared/lambda-construct';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { ContractLambdaFunctions } from '../models/contract/contract-lambda-functions';

export class ContractLambdasConstruct extends cdk.Construct {
    private props: ContractLambdasConstructParms;
    private contractLambdaFunctions: ContractLambdaFunctions = {};
    constructor(parent: cdk.Construct, id: string, props: ContractLambdasConstructParms) {
        super(parent, id);
        this.props = props;
        this.createGetContractsLambda();
    }

    private createGetContractsLambda() {
        const lambdaFun = new LambdaConstruct(this, 'get-contracts-lambda', {
            functionName: `get-contracts-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/java/contract-lambda/target/contract-api-1.0-aws.jar`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                MAIN_CLASS: 'com.gsa.MainApp',
                SPRING_CLOUD_FUNCTION_DEFINITION: 'getContracts',
            },
            handler: 'org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            timeout: 15,
        });
        this.contractLambdaFunctions.getContractsLambda = lambdaFun.lambdaFunction;
    }

    public getContractLambdaFunctions(): ContractLambdaFunctions {
        return this.contractLambdaFunctions;
    }
}
