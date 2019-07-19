const connection = require('../db/connection.js');

exports.insertComment = (body, {
  article_id
}) => {
  //console.log(body)
  //console.log(article_id)
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
