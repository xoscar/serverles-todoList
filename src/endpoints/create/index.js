// models
const Ticket = require('../../models/Ticket');

// libs
const ErrorHandler = require('../../utils/errorHandler');

module.exports = (event, context, callback) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};

  Ticket.create(body)

    .then((ticket) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(ticket.getInfo()),
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
