const API_PREFIX = 'contract-const';
const TABLE_PREFIX = 'contract-const';
const LIVE_ALIAS_NAME = 'live';
const MAX_PROVISIONED_CAPACITY_FOR_LAMBDA = 500;
const LAMBDA_SUBNET_GROUP_NAME = 'Isolated';
const LAMBDA_ARTIFACT_PATH_PREFIX = 'services/contract-const';

const GET_CONTRACT_NOTES_DETAILS_NAME: string = 'get-contract-notes-details';
const GET_CONTRACT_BUYER_DETAILS_NAME: string = 'get-contract-buyer-details';
const GET_CONTRACT_VENDOR_ADDRESS_DETAILS_NAME: string = 'get-contract-vendor-address-details';
const GET_CONTRACT_ACO_OFFICE_ADDRESS_DETAILS_NAME: string = 'get-contract-aco-office-address-details';

const FUNCTION_NAMES = {
    GET_CONTRACT_NOTES_DETAILS_NAME,
    GET_CONTRACT_BUYER_DETAILS_NAME,
    GET_CONTRACT_VENDOR_ADDRESS_DETAILS_NAME,
    GET_CONTRACT_ACO_OFFICE_ADDRESS_DETAILS_NAME,
};

const constants = {
    API_PREFIX,
    LIVE_ALIAS_NAME,
    TABLE_PREFIX,
    MAX_PROVISIONED_CAPACITY_FOR_LAMBDA,
    LAMBDA_ARTIFACT_PATH_PREFIX,
    FUNCTION_NAMES,
    LAMBDA_SUBNET_GROUP_NAME,
};

export { constants };
