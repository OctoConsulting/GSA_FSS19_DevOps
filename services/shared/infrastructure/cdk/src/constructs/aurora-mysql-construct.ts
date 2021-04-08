import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import { AuroraMysqlParms } from '../models/aurora-mysql-construct-parms';
import { Role, AccountPrincipal } from '@aws-cdk/aws-iam';
import { Secret } from '@aws-cdk/aws-secretsmanager';

export class AuroraMysqlConstruct extends cdk.Construct {
    private props: AuroraMysqlParms;

    constructor(parent: cdk.Construct, id: string, props: AuroraMysqlParms) {
        super(parent, id);
        this.props = props;
        this.createAuroraCluster();
    }

    private createAuroraCluster() {
        /**
         * Create Cluster
         */
        this.createCluster();
    }

    private createCluster() {
        const params = this.props.stackContext.auroraMysql;
        const key = new kms.Key(this, 'AuroraKmsKey', {
            enableKeyRotation: true,
        });
        const cluster = new rds.DatabaseCluster(this, 'Database', {
            credentials: rds.Credentials.fromSecret(new Secret(this, 'AuroraClusterMasterSecret')),
            engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
            storageEncrypted: true,
            storageEncryptionKey: key,
            instanceProps: {
                // optional , defaults to t3.medium
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
                vpcSubnets: this.props.vpc.selectSubnets({
                    subnets: this.props.isolatedSubnets,
                }),
                vpc: this.props.vpc,
            },
            instances: params.instanceCount,
            backup: {
                retention: cdk.Duration.days(params.backupRetentionDays),
            },
        });
        console.log();

        const proxy = new rds.DatabaseProxy(this, 'Proxy', {
            proxyTarget: rds.ProxyTarget.fromCluster(cluster),
            secrets: [cluster.secret!],
            vpc: this.props.vpc,
            iamAuth: true,
        });

        cluster.connections.allowDefaultPortFrom(proxy);

        // for the mean time allowing all vpc connections
        const ranges: string[] = params.allowFrom;
        ranges.push(this.props.vpc.vpcCidrBlock);
        for (let range of ranges) {
            proxy.connections.allowFrom(ec2.Peer.ipv4(range), ec2.Port.tcp(3306));
        }

        new cdk.CfnOutput(this, 'ProxyEndpoint', {
            value: proxy.endpoint,
            exportName: 'aurora-mysql-proxy',
        });

        //const role = new Role(this, 'DBProxyRole', { assumedBy: new AccountPrincipal('') });
        //proxy.grantConnect(role, 'admin'); // Grant the role connection access to the DB Proxy for database user 'admin'.
    }
}
