const connection = require('../db/connection.js');

exports.selectTopics = () => {
  return connection.select('*')
    .from('topics');
}

exports.insertTopic = (body) => {

  const { slug, description } = body;
  return connection('topics')
    .insert({
      slug,
      description
    })
    .returning('*')
}

