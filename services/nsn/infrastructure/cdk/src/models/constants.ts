const API_PREFIX = 'nsn-routing';
const LIVE_ALIAS_NAME = 'live';
const MAX_PROVISIONED_CAPACITY_FOR_LAMBDA = 500;
const LAMBDA_SUBNET_GROUP_NAME = 'Isolated';
const NSN_ROUTING_LAMBDA_ZIP_PATH = 'services/nsn/nsn-get-routing/index.zip';
const NSN_ROUTING_FILE_PROCESSOR_LAMBDA_ZIP_PATH = 'services/nsn/nsn-routing-file-processor/index.zip';

const POST_NSN_ROUTING_LAMBDA = 'post-nsn-routing-lambda';
const GET_NSN_ROUTING_LAMBDA = 'get-nsn-routing-lambda';
const PUT_NSN_ROUTING_LAMBDA = 'put-nsn-routing-lambda';
const DELETE_NSN_ROUTING_LAMBDA = 'delete-nsn-routing-lambda';
const NSN_ROUTING_FILE_PROCESSOR = 'nsn-routing-file-processor';

const FUNCTION_NAMES = {
    POST_NSN_ROUTING_LAMBDA,
    GET_NSN_ROUTING_LAMBDA,
    PUT_NSN_ROUTING_LAMBDA,
    DELETE_NSN_ROUTING_LAMBDA,
    NSN_ROUTING_FILE_PROCESSOR,
};

const constants = {
    API_PREFIX,
    FUNCTION_NAMES,
    LIVE_ALIAS_NAME,
    MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
    NSN_ROUTING_LAMBDA_ZIP_PATH,
    NSN_ROUTING_FILE_PROCESSOR_LAMBDA_ZIP_PATH,
    LAMBDA_SUBNET_GROUP_NAME,
};

export { constants };
