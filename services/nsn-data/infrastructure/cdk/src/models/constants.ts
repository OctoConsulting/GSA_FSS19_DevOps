const API_PREFIX = 'entity-management';
const DATA_TABLE_PREFIX = 'entity';
const LIVE_ALIAS_NAME = 'live';
const MAX_PROVISIONED_CAPACITY_FOR_LAMBDA = 500;
const LAMBDA_SUBNET_GROUP_NAME = 'Isolated';
const LAMBDA_ARTIFACT_PATH_PREFIX = 'services/entity-management';

const GET_ENTITY_DETAILS: string = 'get-entity-details';

const FUNCTION_NAMES = {
    GET_ENTITY_DETAILS,
};

const constants = {
    API_PREFIX,
    LIVE_ALIAS_NAME,
    DATA_TABLE_PREFIX,
    MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
    LAMBDA_ARTIFACT_PATH_PREFIX,
    FUNCTION_NAMES,
    LAMBDA_SUBNET_GROUP_NAME,
};

export { constants };
