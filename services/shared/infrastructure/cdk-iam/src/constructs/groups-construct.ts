import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
export class GroupConstruct extends cdk.Construct {
    constructor(parent: cdk.Construct, id: string, props: any) {
        super(parent, id);

        const devs = new iam.Group(this, 'devs', {
            groupName: 'Developers',
        });

        const admins = new iam.Group(this, 'admins', {
            groupName: 'Administrators',
        });
    }

    createAdminPolicy() {
        new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
        });
    }
}
