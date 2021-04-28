export interface RdsDbProps {
    rdsProxyDefaultEndpoint: string;
    rdsProxyArn: string;
    rdsProxyName: string;
    rdsProxySgs: string;
    rdsProxyLambdaUser: string;
    dbName?: string;
}
