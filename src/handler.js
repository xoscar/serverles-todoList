// load env
require('dotenv').config();

const create = require('./endpoints/create');

module.exports = {
  create,
};
