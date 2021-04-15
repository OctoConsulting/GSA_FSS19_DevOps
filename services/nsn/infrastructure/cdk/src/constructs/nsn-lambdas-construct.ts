import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as customResource from '@aws-cdk/custom-resources';
import * as s3 from '@aws-cdk/aws-s3';
import { LambdaConstructProps } from '../models/lambda-construct-props';
import { LambdaFunctions } from '../models/lambda-functions';
import { NsnLambdasConstructParms } from '../models/nsn-lambdas-consruct-props';
import { LambdaConstruct } from './lambda-construct';
import { constants } from '../models/constants';

export class NsnLambdasConstruct extends cdk.Construct {
    private zipPathInsideModules = 'nodejs/nsn-get-routing/dist/nsn-get-routing/index.zip';
    private props: NsnLambdasConstructParms;
    private lambdaFunctions: LambdaFunctions = {};
    private vpc: ec2.IVpc;
    private securityGroup: ec2.ISecurityGroup;
    private artifactVersion: string;

    constructor(parent: cdk.Construct, id: string, props: NsnLambdasConstructParms) {
        super(parent, id);
        this.props = props;
        this.buildPreRequisites();
        this.getArtifactVersion();
        this.lambdaFunctions.postRoutingLambda = this.nsnLambda('post-nsn-routing-lambda', 'index.postNsn');
        this.lambdaFunctions.getRoutingLambda = this.nsnLambda('get-nsn-routing-lambda', 'index.getNsn', false);
        this.lambdaFunctions.putRoutingLambda = this.nsnLambda('put-nsn-routing-lambda', 'index.putNsn');
        this.lambdaFunctions.deleteRoutingLambda = this.nsnLambda('delete-nsn-routing-lambda', 'index.deleteNsn');
    }

    private buildPreRequisites() {
        this.vpc = this.props.vpc;

        this.securityGroup = new ec2.SecurityGroup(this, 'sg', {
            securityGroupName: `${constants.API_PREFIX}-${this.props.shortEnv}`,
            vpc: this.vpc,
        });
    }

    private getArtifactVersion() {
        const s3VersionResource = new customResource.AwsCustomResource(this, `s3VersionResource`, {
            onUpdate: {
                service: 'S3',
                action: 'listObjectVersions',
                parameters: {
                    Bucket: this.props.artifactBucket,
                    Prefix: this.props.artifactKey,
                    MaxKeys: 1,
                },
                physicalResourceId: customResource.PhysicalResourceId.of(Date.now().toString()),
            },
            policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
                resources: customResource.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
        const artifactBucket = s3.Bucket.fromBucketName(this, 'artifact-bucket', this.props.artifactBucket);
        artifactBucket.grantRead(s3VersionResource);
        this.artifactVersion = s3VersionResource.getResponseField('Versions.0.VersionId');
    }

    private nsnLambda(name: string, handler: string, writeAccessToDynamo = true) {
        const dbUser = cdk.Fn.importValue('rds-proxy-lambda-user');
        const lambdaFun = new LambdaConstruct(this, `${name}`, {
            functionName: `${name}-${this.props.shortEnv}`,
            vpc: this.vpc,
            securityGroup: this.securityGroup,
            artifactBucket: this.props.artifactBucket,
            artifactKey: this.props.artifactKey,
            artifactVersion: this.artifactVersion,
            lambdaEnvParameters: {
                SHORT_ENV: this.props.shortEnv,
                TABLE_NAME: this.props.nsnTable.tableName,
                DB_HOST: cdk.Fn.importValue('rds-proxy-default-endpoint'),
                DB_NAME: this.props.mysqlDbName,
                DB_USER: dbUser,
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

        const nsnRdsProxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(this, `rds-proxy-import-${name}`, {
            dbProxyArn: cdk.Fn.importValue('rds-proxy-arn'),
            dbProxyName: cdk.Fn.importValue('rds-proxy-name'),
            endpoint: cdk.Fn.importValue('rds-proxy-default-endpoint'),
            securityGroups: cdk.Fn.split(',', cdk.Fn.importValue('rds-proxy-sgs')).map((sg) =>
                ec2.SecurityGroup.fromSecurityGroupId(this, sg, sg)
            ),
        });
        nsnRdsProxy.grantConnect(lambdaFun.lambdaFunction, dbUser);

        return lambdaFun.alias;
    }

    public getLambdaFunctions(): LambdaFunctions {
        return this.lambdaFunctions;
    }
}
