const connection = require('../db/connection.js');

//TO DO refactor to handle multiple users
exports.selectUser = (
  username
) => {
  return connection.select('*')
    .from('users')
    .where(
      'username', username.username
    ).first().then((row) => row);
}
