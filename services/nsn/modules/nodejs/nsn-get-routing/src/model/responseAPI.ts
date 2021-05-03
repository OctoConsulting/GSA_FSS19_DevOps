export const response = function (statusCode: number, body: { [key: string]: any }) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body, null, 2),
    };
};

export const apiResponses = {
    _200: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _201: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 201,
            body: JSON.stringify(body, null, 2),
        };
    },
    _204: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 204,
            body: JSON.stringify(body, null, 2),
        };
    },
    _400: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
    _404: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 404,
            body: JSON.stringify(body, null, 2),
        };
    },
    _422: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 422,
            body: JSON.stringify(body, null, 2),
        };
    },
    _500: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://fss-ui-dev.fss19-dev.fcs.gsa.gov/",
                "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
            },
            statusCode: 500,
            body: JSON.stringify(body, null, 2),
        };
    },
};
