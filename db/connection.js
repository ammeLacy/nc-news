const dbConfig = require('../knexfile');
const connection = require('knex')(dbConfig);
const setupPaginator = require('knex-paginator');
setupPaginator(connection);


module.exports = connection;
