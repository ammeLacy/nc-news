const connection = require('../db/connection.js');
const {
  isValidId,
  isValidVoteIncrement
} = require('./modelUtils.js');

exports.insertComment = (body, {
  article_id
}) => {
  const {
    username,
    ...fields
  } = body;
  if (username === undefined && body.body === undefined) {
    return Promise.reject({
      status: 400,
      message: 'username and body must not be null'
    });
  }
  if (username === undefined) {
    return Promise.reject({
      status: 400,
      message: 'username must not be null'
    })
  } else if (body.body === undefined) {
    return Promise.reject({
      status: 400,
      message: 'body must not be null'
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
  order = 'desc',
  limit = 10,
  p = 1
}) => {
  if (order !== 'asc') {
    order = 'desc'
  }
  if (!isValidId(limit)) {
    return Promise.reject({
      status: 400,
      message: 'limit must be a whole number'
    })
  }
  const permittedQueries = ['comment_id', 'votes', 'created_at', 'author', 'body'];
  if (!permittedQueries.includes(sort_by)) {
    sort_by = 'created_at';
  }
  const offset = (p - 1) * limit;
  if (!isValidId(p)) {
    return Promise.reject({
      status: 400,
      message: 'page numbers must be a whole number'
    })
  }
  return connection('comments')
    .where({
      article_id
    }).orderBy(sort_by, order)
    .limit(limit)
    .offset(offset)
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
  if (!isValidId(comment_id)) {
    return Promise.reject({
      status: 400,
      message: 'Invalid comment_id'
    })
  } else if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      message: 'inc_votes missing'
    })
  } else if (!isValidVoteIncrement(inc_votes)) {
    return Promise.reject({
      status: 400,
      message: 'votes should be whole numbers'
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
  if (!isValidId(comment_id)) {
    return Promise.reject({
      status: 400,
      message: 'Invalid comment_id'
    })
  } else {
    return connection('comments')
      .where('comments.comment_id', comment_id)
      .del()
  }
}
