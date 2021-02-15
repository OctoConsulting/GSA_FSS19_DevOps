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
        this.createGetContractDetailsByContractIdLambda();
        this.createGetContractDetailsByEntityIdLambda();
    }

    private createGetContractDetailsByContractIdLambda() {
        const lambdaFun = new LambdaConstruct(this, 'get-contract-details-by-contract-id-lambda', {
            functionName: `get-contract-details-by-contract-id-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/java/contract-lambda/target/contract-api-1.0-aws.jar`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                MAIN_CLASS: 'com.gsa.MainApp',
                SPRING_CLOUD_FUNCTION_DEFINITION: 'getContractDetailsByContractId',
            },
            handler: 'org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractDetailsByContractIdLambda = lambdaFun.lambdaFunction;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
    }

    private createGetContractDetailsByEntityIdLambda() {
        const lambdaFun = new LambdaConstruct(this, 'get-contract-details-by-entity-id-lambda', {
            functionName: `get-contract-details-by-entity-id-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/java/contract-lambda/target/contract-api-1.0-aws.jar`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                MAIN_CLASS: 'com.gsa.MainApp',
                SPRING_CLOUD_FUNCTION_DEFINITION: 'getContractDetailsByEntityId',
            },
            handler: 'org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractDetailsByEntityIdLambda = lambdaFun.lambdaFunction;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
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
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractsLambda = lambdaFun.lambdaFunction;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
    }

    public getContractLambdaFunctions(): ContractLambdaFunctions {
        return this.contractLambdaFunctions;
    }
}
