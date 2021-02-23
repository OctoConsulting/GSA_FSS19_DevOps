import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcConstructParms } from '../models/vpc-construct-parms';
import { NetworkBuilder } from '../lib/network-util';

export class VpcConstruct extends cdk.Construct {
    private privateSubnets: ec2.PrivateSubnet[];
    private myVpc: ec2.IVpc;
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
        this.myVpc = ec2.Vpc.fromLookup(this, 'vpc-setup-lookup', {
            vpcId: props.envParameters.vpc
        });
        /**
         * Public, Private and Isolated Subnets
         */
        const vpcRange = this.myVpc.vpcCidrBlock;
        this.networkBuilder = new NetworkBuilder(vpcRange);
        this.subnetConfiguration = [
            {
                name: 'PrivateCICD',
                subnetType: ec2.SubnetType.PRIVATE,
                cidrMask: 24,
            },
            {
                name: `Private${props.envParameters.shortEnv}`,
                subnetType: ec2.SubnetType.PRIVATE,
                cidrMask: 24,
            },
            {
                name: 'Isolated',
                subnetType: ec2.SubnetType.ISOLATED,
                cidrMask: 28,
            },
            {
                name: 'Public',
                subnetType: ec2.SubnetType.PUBLIC,
                cidrMask: 28
            },
            {
                name: 'Reserved',
                subnetType: ec2.SubnetType.ISOLATED,
                reserved: true,
            },
        ]
        this.maxAzs = this.props.envParameters.maxAzs ?? 3;
        this.addInternetGateway(); 
        this.ngws = [];
        this.privateSubnets = [];
        this.addSubnets();
        this.addNatRoutes();
    }
    private addInternetGateway() {
        this.igw = new ec2.CfnInternetGateway(this, 'IGW');
        this.att = new ec2.CfnVPCGatewayAttachment(this, 'VPCGW', {
            internetGatewayId: this.igw.ref,
            vpcId: this.props.envParameters.vpc
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
                vpcId: this.props.envParameters.vpc,
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
