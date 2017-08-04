// dependencies
const uuid = require('uuid-v4');
const moment = require('moment');

// libs
const dynamoManager = require('../utils/dynamoManager')(process.env.DYNAMODB_ITEMS_TABLE);

// static values
const typeConfig = {
  checked: 'boolean',
  description: 'regexp',
  title: 'regexp',
};

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

// internal function
const getFromDynamo = dynamoObj => (
  Ticket(
    Object.assign({
      id: dynamoObj.id,
    }, dynamoObj.info))
);

Ticket.update = (id, newValues) => (
  dynamoManager.retrieveOne(id)

  .then(ticket => (
    dynamoManager.putItem({
      info: Object.assign(getFromDynamo(ticket).getInfo(), newValues),
      id,
    })
  ))

  .then(ticket => (
    Promise.resolve(getFromDynamo(ticket))
  ))
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

    .then(ticket => (
      Promise.resolve(getFromDynamo(ticket))
    ));
};

Ticket.retrieve = id => (
  dynamoManager.retrieveOne(id)

  .then(result => (
    Promise.resolve(getFromDynamo(result))
  ))
);

Ticket.retrieveAll = searchParams => (
  dynamoManager.retrieveAll(searchParams, typeConfig)

  .then(searchResult => (
    Promise.resolve(Object.assign(searchResult, {
      results: searchResult.results.map(result => getFromDynamo(result)),
    }))
  ))
);

Ticket.remove = id => (
  dynamoManager.remove(id)
);

module.exports = Ticket;
