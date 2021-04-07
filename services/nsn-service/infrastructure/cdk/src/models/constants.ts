const API_PREFIX = 'nsn-service';
const NSN_DATA_TABLE_PREFIX = 'nsn';
const LIVE_ALIAS_NAME = 'live';
const MAX_PROVISIONED_CAPACITY_FOR_LAMBDA = 500;
const LAMBDA_SUBNET_GROUP_NAME = 'Isolated';
const LAMBDA_ARTIFACT_PATH_PREFIX = 'services/nsn-service';

const GET_NSN_SERVICE_DETAILS: string = 'get-nsn-service-details';

const FUNCTION_NAMES = {
    GET_NSN_SERVICE_DETAILS,
};

const constants = {
    API_PREFIX,
    LIVE_ALIAS_NAME,
    NSN_DATA_TABLE_PREFIX,
    MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
    LAMBDA_ARTIFACT_PATH_PREFIX,
    FUNCTION_NAMES,
    LAMBDA_SUBNET_GROUP_NAME,
};

export { constants };
