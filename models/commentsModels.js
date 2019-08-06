const connection = require('../db/connection.js');
const {
  isValidArticleId,
  isValidVoteIncrement
} = require('./modelUtils.js');

exports.insertComment = (body, {
  article_id
}) => {
  const {
    username,
    ...fields
  } = body;
  if (body.username === undefined && body.body === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'username and body must not be null'
    });
  }
  if (username === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'username must not be null'
    })
  } else if (body.body === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'body must not be null'
    })
  } else {
    return connection('comments')
      .insert({
        article_id,
        author: username,
        ...fields
      })
      .returning('*');
  }
}


exports.selectComments = ({
  article_id
}, {
  sort_by = 'created_at',
  order = 'desc'
}) => {
  if (order !== 'asc') {
    order = 'desc'
  }
  const permittedQueries = ['comment_id', 'votes', 'created_at', 'author', 'body'];
  if (!permittedQueries.includes(sort_by)) {
    sort_by = 'created_at';
  }
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
  if (!isValidArticleId(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid comment_id'
    })
  } else if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes missing'
    })
  } else if (!isValidVoteIncrement(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: 'votes should be whole numbers'
    })
  } else {
    return connection('comments')
      .where({
        comment_id
      })
      .increment('votes', inc_votes)
      .returning('*');
  }
}

exports.deleteComment = ({
  comment_id
}) => {
  if (!isValidArticleId(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid comment_id'
    })
  } else {
    return connection('comments')
      .where('comments.comment_id', comment_id)
      .del()
  }
}
