// models
const Ticket = require('../../models/Ticket');

// libs
const ErrorHandler = require('../../utils/errorHandler');

module.exports = (event, context, callback) => {
  Ticket.retrieveAll(event.queryStringParameters || {})

    .then((searchResult) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(Object.assign(searchResult, {
          results: searchResult.results.map(result => result.getInfo()),
        })),
      });
    })

    .catch(err => (
      ErrorHandler.handle(err)
    ))

    .catch(err => (
      setTimeout(() => (
        err.send(callback)
      ))
    ));
};
