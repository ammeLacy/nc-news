const connection = require('../db/connection.js');
const {
  selectArticle
} = require('./articlesModels.js');

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
  const {
    inc_votes
  } = body;
  if (inc_votes !== undefined)
    return connection('comments')
      .where({
        comment_id
      })
      .increment('votes', inc_votes)
      .returning('*');
  else {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes missing',
    })
  }

}
