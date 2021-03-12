import * as cdk from '@aws-cdk/core';
import { ContractLambdasConstructParms } from '../models/contract/contract-lambdas-consruct-props';
import { LambdaConstruct } from './shared/lambda-construct';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { ContractLambdaFunctions } from '../models/contract/contract-lambda-functions';
import { constants } from '../models/constants';

export class ContractLambdasConstruct extends cdk.Construct {
    private jarPathInsideModules =
        'java/contract-information-service/target/contract-information-service-0.0.1-SNAPSHOT.jar';
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
            assetLocation: `../../modules/${this.jarPathInsideModules}`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                TABLE_NAME: this.props.contractTable.tableName,
                GSI_BY_CONTRACT_DETAILS_INDEITTY: constants.BY_CONTRACT_DETAILS_IDENTITY_GSI_NAME,
            },
            handler: 'gov.gsa.fas.contractservice.handler.ContractDetailsServiceHandler::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            minCapacity: this.props.minCapacity,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractDetailsByContractIdLambda = lambdaFun.alias;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
    }

    private createGetContractDetailsByEntityIdLambda() {
        const lambdaFun = new LambdaConstruct(this, 'get-contract-details-by-entity-id-lambda', {
            functionName: `get-contract-details-by-entity-id-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/${this.jarPathInsideModules}`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                TABLE_NAME: this.props.contractTable.tableName,
                GSI_BY_CONTRACT_DETAILS_INDEITTY: constants.BY_CONTRACT_DETAILS_IDENTITY_GSI_NAME,
            },
            handler: 'gov.gsa.fas.contractservice.handler.ListContractsServiceHandler::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            logRetentionInDays: this.props.logRetentionInDays,
            minCapacity: this.props.minCapacity,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractDetailsByEntityIdLambda = lambdaFun.alias;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
    }

    private createGetContractsLambda() {
        const lambdaFun = new LambdaConstruct(this, 'get-contracts-lambda', {
            functionName: `get-contracts-lambda-${this.props.shortEnv}`,
            vpcId: this.props.vpc,
            assetLocation: `../../modules/${this.jarPathInsideModules}`,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                TABLE_NAME: this.props.contractTable.tableName,
                GSI_BY_CONTRACT_DETAILS_INDEITTY: constants.BY_CONTRACT_DETAILS_IDENTITY_GSI_NAME,
            },
            minCapacity: this.props.minCapacity,
            handler: 'gov.gsa.fas.contractservice.handler.ServiceHandler::handleRequest',
            type: LambdaConstructProps.LambdaTypeEnum.JAVA,
            logRetentionInDays: this.props.logRetentionInDays,
            timeout: 15,
            xRayTracing: this.props.xRayTracing,
        });
        this.contractLambdaFunctions.getContractsLambda = lambdaFun.alias;
        this.props.contractTable.grantReadData(lambdaFun.lambdaFunction);
    }

    public getContractLambdaFunctions(): ContractLambdaFunctions {
        return this.contractLambdaFunctions;
    }
}
