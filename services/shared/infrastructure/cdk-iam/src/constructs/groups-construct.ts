import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { GroupsConstructProps } from '../models/groups-construct-props';
export class GroupsConstruct extends cdk.Construct {
    private props: GroupsConstructProps;
    private groups: iam.Group[] = [];
    constructor(parent: cdk.Construct, id: string, props: GroupsConstructProps) {
        super(parent, id);
        this.props = props;
        this.createGroups();
    }

    private createGroups() {
        this.props.groupNames.forEach((groupName) => {
            const group = new iam.Group(this, `${groupName}`, {
                groupName: groupName,
            });
            this.groups.push(group);
        });
    }

    getGroups() {
        return this.groups;
    }
}
