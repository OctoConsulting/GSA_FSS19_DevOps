/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
export const success = (body: string, results: object | Array<string>, code: number) => {
    return {
      body,
      error: false,
      statusCode: code,
      results
    };
  };
  
  /**
   * @desc    Send any error response
   *
   * @param   {string} message
   * @param   {number} statusCode
   */
  export const error = (body: string, code: number, err?: object) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  
    // Get matched code
    const findCode = codes.find((code) => code == code);
  
    if (!findCode) code = 500;
    else code = findCode;
  
    return {
      body,
      statusCode: code,
      error: true,
      exception: err
    };
  };
  
  /**
   * @desc    Send any validation response
   *
   * @param   {object | array} errors
   */
  export const validation = (errors: object | Array<string>) => {
    return {
      body: "Validation errors",
      error: true,
      statusCode: 422,
      errors
    };
  };