const connection = require('../db/connection.js');

//TO DO refactor to handle multiple users
//Handle invalid users to be added decided what a valid usename is
exports.selectUser = (
  username
) => {
  return connection.select('*')
    .from('users')
    .where(
      'username', username.username
    ).first().then((row) => row);
}
