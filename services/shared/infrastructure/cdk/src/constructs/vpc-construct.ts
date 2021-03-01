import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcConstructParms } from '../models/vpc-construct-parms';
import { NetworkBuilder } from '../lib/network-util';

export class VpcConstruct extends cdk.Construct {
    private privateSubnets: ec2.PrivateSubnet[];
    private isolatedSubnets: ec2.Subnet[];
    private props: VpcConstructParms;
    private networkBuilder: NetworkBuilder;
    private subnetConfiguration: ec2.SubnetConfiguration[];
    private ngws: ec2.CfnNatGateway[];
    private igw: ec2.CfnInternetGateway;
    private att: ec2.CfnVPCGatewayAttachment;
    private maxAzs: number;
    constructor(parent: cdk.Construct, id: string, props: VpcConstructParms) {
        super(parent, id);
        this.props = props;
        this.subnetConfiguration = [];
        /**
         * Public, Private and Isolated Subnets
         */
        const vpcRange = this.props.vpc.vpcCidrBlock;
        this.networkBuilder = new NetworkBuilder(vpcRange);
        for (const config of this.props.envParameters.subnetConfiguration) {
            this.subnetConfiguration.push({
                name: config.name,
                subnetType: getSubnetType(config.subnetType)!,
                cidrMask: config.cidrMask,
                reserved: (config.reserved === true)
            });
        }
        this.maxAzs = this.props.envParameters.maxAzs ?? 3;
        this.addInternetGateway(); 
        this.ngws = [];
        this.privateSubnets = [];
        this.isolatedSubnets = [];
        this.addSubnets();
        this.addNatRoutes();
        this.addInternalRoutes(this.privateSubnets);
        this.addInternalRoutes(this.isolatedSubnets);
    }
    private addInternetGateway() {
        this.igw = new ec2.CfnInternetGateway(this, 'IGW');
        this.att = new ec2.CfnVPCGatewayAttachment(this, 'VPCGW', {
            internetGatewayId: this.igw.ref,
            vpcId: this.props.envParameters.vpcId
        });
    }
    addSubnets() {
        this.props.availabilityZones = this.props.availabilityZones.slice(0, this.maxAzs);
        const remainingSpaceSubnets: ec2.SubnetConfiguration[] = [];
        for (const subnet of this.subnetConfiguration) {
            if (subnet.cidrMask === undefined) {
              remainingSpaceSubnets.push(subnet);
              continue;
            }
            this.createSubnetResources(subnet, subnet.cidrMask);
        }
        const totalRemaining = remainingSpaceSubnets.length * this.props.availabilityZones.length;
        const cidrMaskForRemaining = this.networkBuilder.maskForRemainingSubnets(totalRemaining);
        for (const subnet of remainingSpaceSubnets) {
            this.createSubnetResources(subnet, cidrMaskForRemaining);
        }
    }
    private createSubnetResources(subnetConfig: ec2.SubnetConfiguration, cidrMask: number) {
        this.props.availabilityZones.forEach((zone, index) => {
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
                mapPublicIpOnLaunch: (subnetConfig.subnetType === ec2.SubnetType.PUBLIC),
            };
            let subnet: ec2.Subnet;
            switch (subnetConfig.subnetType) {
              case ec2.SubnetType.PUBLIC:
                const publicSubnet = new ec2.PublicSubnet(this, name, subnetProps);
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
            cdk.Tags.of(subnet).add(SUBNETTYPE_TAG, subnetTypeTagValue(subnetConfig.subnetType), { includeResourceTypes });
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
            for (const cidr of this.props.envParameters.addonRoutesCidrs!)
                sub.addRoute(`InternalRoute${j++}`, {
                    routerId: this.props.envParameters.addonRoutesVgw!,
                    routerType: ec2.RouterType.GATEWAY,
                    destinationCidrBlock: cidr,
                })
        }
    }
    public getIsolatedSubnets() {
        return this.isolatedSubnets;
    }
}
const SUBNETTYPE_TAG = 'aws-cdk:subnet-type';
const SUBNETNAME_TAG = 'aws-cdk:subnet-name';

function subnetTypeTagValue(type: ec2.SubnetType) {
  switch (type) {
    case ec2.SubnetType.PUBLIC: return 'Public';
    case ec2.SubnetType.PRIVATE: return 'Private';
    case ec2.SubnetType.ISOLATED: return 'Isolated';
  }
}

function getSubnetType(type: string) {
    switch(type) {
        case "PUBLIC": return ec2.SubnetType.PUBLIC;
        case "PRIVATE": return ec2.SubnetType.PRIVATE;
        case "ISOLATED": return ec2.SubnetType.ISOLATED;
    }
    return ec2.SubnetType.ISOLATED;
}