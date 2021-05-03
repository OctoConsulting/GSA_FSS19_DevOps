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
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _201: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 201,
            body: JSON.stringify(body, null, 2),
        };
    },
    _204: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 204,
            body: JSON.stringify(body, null, 2),
        };
    },
    _400: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
    _404: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 404,
            body: JSON.stringify(body, null, 2),
        };
    },
    _422: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 422,
            body: JSON.stringify(body, null, 2),
        };
    },
    _500: (body: { [key: string]: any }) => {
        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            statusCode: 500,
            body: JSON.stringify(body, null, 2),
        };
    },
};
