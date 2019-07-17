const connection = require('../db/connection.js');

exports.selectTopics = () => {
  //console.log('insideTopic Model');
  return connection.select('*')
    .from('topics');
}
