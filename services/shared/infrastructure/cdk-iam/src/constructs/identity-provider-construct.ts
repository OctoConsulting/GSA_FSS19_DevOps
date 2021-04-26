import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { OktaProviderConstructProps } from '../models/okta-provider-construct-props';

export class IdentityProviderConstruct extends cdk.Construct {
    private props: OktaProviderConstructProps;

    constructor(parent: cdk.Construct, id: string, props: OktaProviderConstructProps) {
        super(parent, id);
        this.props = props;

        this.addSamlProvider();
        this.addUser();
    }

    addSamlProvider() {
        const provider = new iam.SamlProvider(this, 'Provider', {
            metadataDocument: iam.SamlMetadataDocument.fromFile(this.props.samlMetadataFilePath),
        });
    }

    addUser() {
        const user = new iam.User(this, 'user', {
            userName: this.props.userName,
        });

        user.attachInlinePolicy(
            new iam.Policy(this, 'policy', {
                statements: [
                    new iam.PolicyStatement({
                        actions: ['iam:ListRoles', 'iam:ListAccountAliases'],
                        resources: ['*'],
                    }),
                ],
            })
        );
    }
}
