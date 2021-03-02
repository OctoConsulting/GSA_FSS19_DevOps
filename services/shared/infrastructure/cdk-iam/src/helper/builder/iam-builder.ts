import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { BaseBuilder } from './common/BaseBulider';

export class IamBuilder extends BaseBuilder {
    private permission: string;

    constructor(permission: string, arnPrefix: string) {
        super();
        this.permission = permission;
        this.arnPrefix = arnPrefix;
    }

    public getPolicyStatements(): PolicyStatement[] {
        if (this.permission === 'iam-mfa') {
            return this.mfa();
        }

        return this.unimplimented(this.permission);
    }

    private mfa(): PolicyStatement[] {
        const viewAccountInfo = new PolicyStatement({
            actions: [
                'iam:GetAccountPasswordPolicy',
                'iam:GetAccountSummary',
                'iam:ListVirtualMFADevices',
                'iam:ListUsers',
            ],
            resources: ['*'],
        });

        const allowManageOwnPasswords = new PolicyStatement({
            actions: ['iam:ChangePassword', 'iam:GetUser'],
            resources: [`${this.getServicePrefix()}` + 'user/${aws:username}'],
        });

        const allowManageOwnMfaDevices = new PolicyStatement({
            actions: ['iam:CreateVirtualMFADevice', 'iam:DeleteVirtualMFADevice'],
            resources: [`${this.getServicePrefix()}` + 'mfa/${aws:username}'],
        });

        const allowManageOwnUserMfa = new PolicyStatement({
            actions: ['iam:DeactivateMFADevice', 'iam:EnableMFADevice', 'iam:ListMFADevices', 'iam:ResyncMFADevice'],
            resources: [`${this.getServicePrefix()}` + 'user/${aws:username}'],
        });

        const denyAllExceptListedIfNoMFA = new PolicyStatement({
            effect: Effect.DENY,
            notActions: [
                'iam:CreateVirtualMFADevice',
                'iam:EnableMFADevice',
                'iam:GetUser',
                'iam:ListMFADevices',
                'iam:ListVirtualMFADevices',
                'iam:ListUsers',
                'iam:ResyncMFADevice',
                'sts:GetSessionToken',
            ],
            resources: ['*'],
            conditions: {
                BoolIfExists: {
                    'aws:MultiFactorAuthPresent': 'false',
                },
            },
        });

        return [
            viewAccountInfo,
            allowManageOwnPasswords,
            allowManageOwnMfaDevices,
            allowManageOwnUserMfa,
            denyAllExceptListedIfNoMFA,
        ];
    }
}
