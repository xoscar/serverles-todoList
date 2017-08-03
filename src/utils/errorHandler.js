/**
 * ErrorHandler instance to storage in run time memory.
 * @param {Object} options The basic error options.
 */
function ErrorHandler(options) {
  /**
   * Sends the error response and closes the request.
   * @param  {Function} callback The finalizer async function.
   */
  this.send = (callback) => {
    callback(null, {
      statusCode: options.statusCode,
      body: JSON.stringify(options.code),
    });
  };

  this.toString = () => (
    JSON.stringify(options)
  );
}

/**
 * Gets an error and decide wheter to create a new instance of the `ErrorHandled` or just forward it to next reject handler.
 * @param  {String} type   Expected type of the error.
 * @param  {String} source The source service.
 * @param  {Object} err    The actual error.
 * @return {Promise}        Chain reject promise untill finish.
 */
ErrorHandler.handle = (err) => {
  // If we have a handled error follow it to the next catch
  if (err instanceof ErrorHandler) {
    return Promise.reject(err);
  }

  // Create a generic error and handle it to the next catch.
  if (err.code) {
    const genericObj = new ErrorHandler({
      statusCode: err.statusCode,
      code: err.code,
    });

    console.log('ERROR', genericObj.toString());

    return Promise.reject(genericObj);
  }

  const unknownError = new ErrorHandler({
    statusCode: 504,
    code: `ERROR: ${err}`,
  });

  console.log('ERROR', unknownError.toString());
  return Promise.reject(unknownError);
};

module.exports = ErrorHandler;
