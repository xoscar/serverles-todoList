// load env
require('dotenv').config();

const create = require('./endpoints/create');
const retrieve = require('./endpoints/retrieve');
const retrieveOne = require('./endpoints/retrieveOne');
const update = require('./endpoints/update');
const remove = require('./endpoints/remove');

module.exports = {
  create,
  retrieve,
  retrieveOne,
  update,
  remove,
};
