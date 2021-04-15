
export const getSettings = () => {
    return {
        TABLE_NAME: 'contract-const-data-'+process.env.SHORT_ENV == undefined ? 'dev' : process.env.SHORT_ENV,
        IS_OFFLINE: process.env.IS_OFFLINE,
    };
};