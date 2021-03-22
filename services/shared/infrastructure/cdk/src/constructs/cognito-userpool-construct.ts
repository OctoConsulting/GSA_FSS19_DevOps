import { 
  AwsCustomResourcePolicy,
  AwsCustomResource,
  PhysicalResourceId
} from "@aws-cdk/custom-resources";
import { CertificateValidation, Certificate } from '@aws-cdk/aws-certificatemanager';
import {
  UserPool, 
  AccountRecovery,
  OAuthScope,
  UserPoolClientIdentityProvider,
  UserPoolClient,
  UserPoolDomain
} from "@aws-cdk/aws-cognito";
import { 
  HostedZone,
  ARecord,
  RecordTarget,
 } from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Secret, CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { CognitoConstructParms } from '../models/cognito-construct-parms';

export class CognitoConstruct extends cdk.Construct {
  private props: CognitoConstructParms;
  private userPoolClientSecret: string;
  private userPoolClientSecretArn: string;
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  constructor(parent: cdk.Construct, id: string, props: CognitoConstructParms) {
    super(parent, id);
    this.props = props;
    this.createUserPool();
    this.addUserPoolClient();
    this.userPoolClientSecret = this.extractCognitoClientSecretString();
    this.userPoolClientSecretArn = this.createCognitoUserPoolSecret();
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("jenkins", {
      generateSecret: true,
      preventUserExistenceErrors: true,
      oAuth: {
        callbackUrls: [
          `https://jenkins.${this.props.stackContext.domainName}/securityRealm/finishLogin`,
          `https://jenkins.${this.props.stackContext.domainName}`
        ],
        logoutUrls: [
          `https://jenkins.${this.props.stackContext.domainName}/OicLogout`,
          `https://jenkins.${this.props.stackContext.domainName}/securityRealm/finishLogin`
        ],
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [
          OAuthScope.OPENID,
          OAuthScope.EMAIL,
          OAuthScope.PROFILE
        ]
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO
      ],
      authFlows: {
        custom: false,
        userPassword: true,
        userSrp: true
      }
    });
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "userPool", {
      accountRecovery: AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA,
      selfSignUpEnabled: false,
      autoVerify: { email: true },
      signInCaseSensitive: false,
      standardAttributes: {
        email: {
          mutable: false,
          required: true
        }
      }
    });

    this.userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: `fss19-${this.props.envParameters.shortEnv}`
      }
    });
  }

  private extractCognitoClientSecretString() {
    const describeCognitoUserPoolClient = new AwsCustomResource(
      this,
      'DescribeCognitoUserPoolClient', {
        resourceType: 'Custom::DescribeCognitoUserPoolClient',
        onCreate: {
          region: this.props.envParameters.region,
          service: 'CognitoIdentityServiceProvider',
          action: 'describeUserPoolClient',
          parameters: {
            UserPoolId: this.userPool.userPoolId,
            ClientId: this.userPoolClient.userPoolClientId,
          },
          physicalResourceId: PhysicalResourceId.of(this.userPoolClient.userPoolClientId),
        },
        // TODO: can we restrict this policy more?
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    )
    return describeCognitoUserPoolClient.getResponseField(
      'UserPoolClient.ClientSecret'
    );
  }

  private createCognitoUserPoolSecret(): string {
    const secret = new Secret(this, 'CognitoUserPoolClientSecret');
    const cfnSecret = secret.node.defaultChild as CfnSecret;
    cfnSecret.generateSecretString = undefined;
    cfnSecret.secretString = "{" +
      `"userPoolClientId": "${this.userPoolClient.userPoolClientId}",` +
      `"userPoolClientSecret": "${this.userPoolClientSecret}"` +
      "}"
    return secret.secretArn;
  }

  public getCognitoUserPoolSecretArn() {
    return this.userPoolClientSecretArn
  }
}