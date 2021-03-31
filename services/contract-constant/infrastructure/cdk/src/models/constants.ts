const API_PREFIX = 'contract-const';
const TABLE_PREFIX = 'contract-const';
const LIVE_ALIAS_NAME = 'live';
const MAX_PROVISIONED_CAPACITY_FOR_LAMBDA = 500;
const LAMBDA_SUBNET_GROUP_NAME = 'Isolated';
//TODO when actual artifact is deployed
const NSN_ROUTING_LAMBDA_ZIP_PATH = 'services/contract-const/nsn-get-routing/index.zip';
const constants = {
    API_PREFIX,
    LIVE_ALIAS_NAME,
    TABLE_PREFIX,
    MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
    NSN_ROUTING_LAMBDA_ZIP_PATH,
    LAMBDA_SUBNET_GROUP_NAME,
};

export { constants };
