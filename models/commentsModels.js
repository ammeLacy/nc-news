const connection = require('../db/connection.js');

exports.insertComment = (body, {
  article_id
}) => {
  //console.log(insertComment body)
  const {
    username,
    ...fields
  } = body;
  return connection('comments')
    .insert({
      article_id,
      author: username,
      ...fields
    })
    .returning('*');
}

exports.selectComments = ({
  article_id
}) => {
  //console.log('inside selectComments  model')
  //console.log(article_id)
  //console.log(connection)
  return connection('comments')
    .where({
      article_id
    })
    .returning('*');
}
