import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import * as iam from '@aws-cdk/aws-iam';

import { StaticWebConstructProps } from '../models/static-web-construct-props';

export class StaticWebConstruct extends cdk.Construct {
    private props: StaticWebConstructProps;
    constructor(parent: cdk.Construct, id: string, props: StaticWebConstructProps) {
        super(parent, id);
        this.props = props;
        const myBucket = new s3.Bucket(this, 's3-bucket', {
            bucketName: `fss-ui-${props.shortEnv}.${props.domainSuffix}`,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        // Allow jenkins worker to read and write into the s3 bucket for deployments
        const jenkinsWorkerTaskRole = iam.Role.fromRoleArn(
            this,
            'jenkins-role-import',
            cdk.Fn.importValue('jenkins-worker-role-arn')
        );
        myBucket.grantReadWrite(jenkinsWorkerTaskRole);

        const domainName = `fss-ui-${props.shortEnv}.${props.domainSuffix}`;
        const hostedZone = route53.HostedZone.fromLookup(this, 'cloudfront-hosted-zone-lookup', {
            domainName: `${props.domainSuffix}`,
        });
        const privateHostedZone = route53.HostedZone.fromLookup(this, 'cloudfront-private-hosted-zone-lookup', {
            domainName: `${props.domainSuffix}`,
            privateZone: true,
        });

        const certificate = new acm.Certificate(this, 'Certificate', {
            domainName: domainName,
            validation: acm.CertificateValidation.fromDns(hostedZone),
        });

        const origin = new origins.S3Origin(myBucket);
        const myCloudFront = new cloudfront.Distribution(this, 'cloudfront-distribution', {
            defaultBehavior: { origin },
            domainNames: [domainName],
            certificate,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            defaultRootObject: 'index.html',
            additionalBehaviors: {
                'index.html': {
                    origin: origin,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                },
            },
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    ttl: cdk.Duration.seconds(300),
                    responsePagePath: '/index.html',
                },
            ],
        });

        this.addRoute53Alias(myCloudFront, domainName, privateHostedZone);
    }

    addRoute53Alias(cloudFront: cloudfront.Distribution, domainName: string, hostedZone: route53.IHostedZone) {
        new route53.ARecord(this, 'cloudfront-route53', {
            recordName: domainName,
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(cloudFront)),
        });
    }
}
