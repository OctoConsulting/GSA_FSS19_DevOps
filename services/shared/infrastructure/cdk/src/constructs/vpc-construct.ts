import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcConstructParms, ExtendedSubnetConfiguration } from '../models/vpc-construct-parms';
import { NetworkBuilder } from '../lib/network-util';

export class VpcConstruct extends cdk.Construct {
    private publicSubnets: ec2.PublicSubnet[];
    private privateSubnets: ec2.PrivateSubnet[];
    private isolatedSubnets: ec2.Subnet[];
    private props: VpcConstructParms;
    private networkBuilder: NetworkBuilder;
    private extendedSubnetConfiguration: ExtendedSubnetConfiguration[];
    private ngws: ec2.CfnNatGateway[];
    private igw: ec2.CfnInternetGateway;
    private att: ec2.CfnVPCGatewayAttachment;
    private maxAzs: number;
    constructor(parent: cdk.Construct, id: string, props: VpcConstructParms) {
        super(parent, id);
        this.props = props;
        this.extendedSubnetConfiguration = [];
        /**
         * Public, Private and Isolated Subnets
         */
        this.maxAzs = this.props.stackContext.maxAzs ?? 3;
        const vpcRange = this.props.vpc.vpcCidrBlock;
        this.networkBuilder = new NetworkBuilder(vpcRange);
        for (const config of this.props.stackContext.extendedSubnetConfiguration) {
            this.extendedSubnetConfiguration.push({
                subnetConfiguration: {
                    name: config.subnetConfiguration.name,
                    subnetType: (<any>ec2.SubnetType)[config.subnetConfiguration.subnetType],
                    cidrMask: config.subnetConfiguration.cidrMask,
                    reserved: config.subnetConfiguration.reserved === true,
                },
                availibilityZonesCount: config.availabilityZonesCount ?? this.maxAzs,
            });
        }
        this.addInternetGateway();
        this.ngws = [];
        this.privateSubnets = [];
        this.isolatedSubnets = [];
        this.publicSubnets = [];
        this.addSubnets();
        this.addNatRoutes();
        this.addInternalRoutes(this.privateSubnets);
        this.addInternalRoutes(this.isolatedSubnets);
    }
    private addInternetGateway() {
        this.igw = new ec2.CfnInternetGateway(this, 'IGW');
        this.att = new ec2.CfnVPCGatewayAttachment(this, 'VPCGW', {
            internetGatewayId: this.igw.ref,
            vpcId: this.props.envParameters.vpcId,
        });
    }
    private addSubnets() {
        const defaultAvailabilityZones = this.props.availabilityZones.slice(0, this.maxAzs);
        const remainingSpaceSubnets: ec2.SubnetConfiguration[] = [];
        for (const extendedSubnet of this.extendedSubnetConfiguration) {
            const subnet = extendedSubnet.subnetConfiguration;
            if (subnet.cidrMask === undefined) {
                remainingSpaceSubnets.push(subnet);
                continue;
            }
            this.createSubnetResources(subnet, subnet.cidrMask, extendedSubnet.availibilityZonesCount);
        }
        const totalRemaining = remainingSpaceSubnets.length * defaultAvailabilityZones.length;
        const cidrMaskForRemaining = this.networkBuilder.maskForRemainingSubnets(totalRemaining);
        for (const subnet of remainingSpaceSubnets) {
            this.createSubnetResources(subnet, cidrMaskForRemaining);
        }
    }
    private createSubnetResources(
        subnetConfig: ec2.SubnetConfiguration,
        cidrMask: number,
        subnetAvailabilityZoneCount = this.maxAzs
    ) {
        const subnetGroupAvailabilityZones = this.props.availabilityZones.slice(0, subnetAvailabilityZoneCount);
        subnetGroupAvailabilityZones.forEach((zone, index) => {
            if (subnetConfig.reserved === true) {
                // For reserved subnets, just allocate ip space but do not create any resources
                this.networkBuilder.addSubnet(cidrMask);
                return;
            }
            const name = `${subnetConfig.name}Subnet${index + 1}`;
            const subnetProps: ec2.SubnetProps = {
                availabilityZone: zone,
                vpcId: this.props.envParameters.vpcId,
                cidrBlock: this.networkBuilder.addSubnet(cidrMask),
                mapPublicIpOnLaunch: subnetConfig.subnetType === ec2.SubnetType.PUBLIC,
            };
            let subnet: ec2.Subnet;
            switch (subnetConfig.subnetType) {
                case ec2.SubnetType.PUBLIC:
                    const publicSubnet = new ec2.PublicSubnet(this, name, subnetProps);
                    this.publicSubnets.push(publicSubnet);
                    publicSubnet.addDefaultInternetRoute(this.igw.ref, this.att);
                    subnet = publicSubnet;
                    this.ngws.push(publicSubnet.addNatGateway());
                    break;
                case ec2.SubnetType.PRIVATE:
                    const privateSubnet = new ec2.PrivateSubnet(this, name, subnetProps);
                    this.privateSubnets.push(privateSubnet);
                    subnet = privateSubnet;
                    break;
                case ec2.SubnetType.ISOLATED:
                    const isolatedSubnet = new ec2.PrivateSubnet(this, name, subnetProps);
                    this.isolatedSubnets.push(isolatedSubnet);
                    subnet = isolatedSubnet;
                    break;
                default:
                    throw new Error(`Unrecognized subnet type: ${subnetConfig.subnetType}`);
            }

            // These values will be used to recover the config upon provider import
            const includeResourceTypes = [ec2.CfnSubnet.CFN_RESOURCE_TYPE_NAME];
            cdk.Tags.of(subnet).add(SUBNETNAME_TAG, subnetConfig.name, { includeResourceTypes });
            cdk.Tags.of(subnet).add(SUBNETTYPE_TAG, subnetTypeTagValue(subnetConfig.subnetType), {
                includeResourceTypes,
            });
        });
    }
    private addNatRoutes() {
        let i = 0;
        for (const sub of this.privateSubnets) {
            sub.addDefaultNatRoute(this.ngws[i++ % this.maxAzs].ref);
        }
    }
    private addInternalRoutes(subnets: ec2.Subnet[]) {
        for (const sub of subnets) {
            let j = 1;
            for (const cidr of this.props.stackContext.addonRoutesCidrs!)
                sub.addRoute(`InternalRoute${j++}`, {
                    routerId: this.props.vpc.vpnGatewayId!,
                    routerType: ec2.RouterType.GATEWAY,
                    destinationCidrBlock: cidr,
                });
        }
    }
    public getIsolatedSubnets() {
        return this.isolatedSubnets;
    }

    public getPrivateSubnets() {
        return this.privateSubnets;
    }

    public getPrivateCICDSubnets() {
        return this.selectSubnetObjectsByName('PrivateCICD');
    }

    public getIsolatedLambdaSubnets() {
        return this.selectSubnetObjectsByName('Isolated');
    }

    public getIsolatedRoute53ResolverSubnets() {
        return this.selectSubnetObjectsByName('IsolatedDnsResolvers');
    }

    private selectSubnetObjectsByName(groupName: string) {
        const allSubnets = [...this.publicSubnets, ...this.privateSubnets, ...this.isolatedSubnets];
        const subnets = allSubnets.filter((s) => subnetGroupNameFromConstructId(s) === groupName);

        if (subnets.length === 0) {
            const names = Array.from(new Set(allSubnets.map(subnetGroupNameFromConstructId)));
            throw new Error(
                `There are no subnet groups with name '${groupName}' in this VPC. Available names: ${names}`
            );
        }
        return subnets;
    }
}
const SUBNETTYPE_TAG = 'aws-cdk:subnet-type';
const SUBNETNAME_TAG = 'aws-cdk:subnet-name';

function subnetTypeTagValue(type: ec2.SubnetType) {
    switch (type) {
        case ec2.SubnetType.PUBLIC:
            return 'Public';
        case ec2.SubnetType.PRIVATE:
            return 'Private';
        case ec2.SubnetType.ISOLATED:
            return 'Isolated';
    }
}

function subnetGroupNameFromConstructId(subnet: ec2.ISubnet) {
    return subnet.node.id.replace(/Subnet\d+$/, '');
}
