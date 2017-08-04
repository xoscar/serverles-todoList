// models
const Ticket = require('../../models/Ticket');

// libs
const ErrorHandler = require('../../utils/errorHandler');

module.exports = (event, context, callback) => {
  Ticket.remove(event.pathParameters.id)

    .then(() => {
      callback(null, {
        statusCode: 202,
        body: JSON.stringify('Accepted.'),
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
