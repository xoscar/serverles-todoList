// dependencies
const uuid = require('uuid-v4');
const moment = require('moment');

// libs
const dynamoManager = require('../utils/dynamoManager')(process.env.DYNAMODB_ITEMS_TABLE);

const Ticket = ({ id, title, description, checked, createdAt }) => {
  const toggleCheck = () => {
    dynamoManager.putItem({
      id,
      title,
      description,
      createdAt,
      checked: !checked,
    });
  };

  const getInfo = () => ({
    id,
    title,
    description,
    checked,
    createdAt: moment(createdAt).format('DD-MM-YYYY HH:mm:ss'),
  });

  return {
    toggleCheck,
    getInfo,
  };
};

const getFromDynamo = dynamoObj => (
  Ticket(
    Object.assign({
      id: dynamoObj.id,
    }, dynamoObj.info))
);

Ticket.create = ({ title, description, checked }) => {
  const id = uuid();
  const createdAt = Date.now();

  return dynamoManager

    .putItem({
      id,
      info: {
        title,
        description,
        checked,
        createdAt,
      },
    })

    .then(() => (
      Promise.resolve(Ticket({
        id,
        title,
        description,
        checked,
        createdAt,
      }))
    ));
};

Ticket.retrieve = id => (
  dynamoManager.retrieveOne(id)

  .then(result => (
    Promise.resolve(getFromDynamo(result))
  ))
);

Ticket.retrieveAll = () => (
  dynamoManager.retrieveAll()

  .then(results => (
    Promise.resolve(results.map(result => getFromDynamo(result)))
  ))
);

Ticket.remove = id => (
  dynamoManager.remove(id)
);

module.exports = Ticket;
