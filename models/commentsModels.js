const connection = require('../db/connection.js');

exports.insertComment = (body, {
  article_id
}) => {
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
  return connection('comments')
    .where({
      article_id
    }).orderBy(sort_by, order)
    .returning('*');
}

exports.updateComment = (
  body, {
    comment_id
  }
) => {
  return connection('comments')
    .where({
      comment_id
    })
    .update({
      votes: connection.raw('votes + ' + body.inc_votes)
    })
    .returning('*');

}
