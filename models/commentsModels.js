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
}, {
  sort_by = 'created_at',
  order = 'desc'
}) => {
  //console.log('inside selectComments  model')
  //console.log(article_id)
  //console.log(connection)
  // console.log(order)
  return connection('comments')
    .where({
      article_id
    }).orderBy(sort_by, order)
    .returning('*');
}
