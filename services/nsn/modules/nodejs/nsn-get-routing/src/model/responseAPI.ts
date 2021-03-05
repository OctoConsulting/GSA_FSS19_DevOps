
export const apiResponses = {
    _200: (body: { [key: string]: any }) => {
        return {
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _201: (body: { [key: string]: any }) => {
      return {
          statusCode: 201,
          body: JSON.stringify(body, null, 2),
      };
    },
    _400: (body: { [key: string]: any }) => {
        return {
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
    _404: (body: { [key: string]: any }) => {
      return {
          statusCode: 404,
          body: JSON.stringify(body, null, 2),
      };
    },
    _422: (body: { [key: string]: any }) => {
      return {
          statusCode: 422,
          body: JSON.stringify(body, null, 2),
      };
    },
  _500: (body: { [key: string]: any }) => {
    return {
        statusCode: 500,
        body: JSON.stringify(body, null, 2),
    };
  },
};