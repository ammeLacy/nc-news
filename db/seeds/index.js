const {
  userData,
  topicData,
} = require('../data');


exports.seed = function (knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('users')
        .returning('*');
    })
    .then(() => {
      return knex('topics')
        .returning('*');
      // <-- do the rest of the seed logic here ...
    });
};
