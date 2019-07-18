const connection = require('../db/connection.js');

exports.selectUser = (
  username
) => {
  console.log('inside Users Model');
  return connection.select('*')
    .from('users')
    .where(
      'username', username.username
    ).first().then((row) => row);
}
