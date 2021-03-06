const connection = require('../db/connection.js');
const {
  isValidId,
  isValidVoteIncrement,
  hasAllKeys
} = require('./modelUtils.js');

//multiple articles
exports.selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  p = 1
}) => {
  if (order !== 'asc') {
    order = 'desc'
  }
  if (!isValidId(limit)) {
    return Promise.reject({
      status: 400,
      message: "limit should be whole numbers"
    })
  } else {
    const permittedQueries = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
    if (!permittedQueries.includes(sort_by)) {
      sort_by = 'created_at';
    }
    if (!isValidId(p)) {
      return Promise.reject({
        status: 400,
        message: "page numbers should be whole numbers"
      })
    }
    const offset = (p - 1) * limit;
    return connection.select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes', 'users.avatar_url')
      .count({
        comment_count: 'comment_id'
      })
      .from('articles')
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .leftJoin('users', 'articles.author', 'users.username')
      .groupBy('articles.article_id', 'users.avatar_url').orderBy(sort_by, order)
      .limit(limit)
      .offset(offset)
      .modify((query) => {
        if (author) {
          query.where(
            'articles.author', author
          )
        }
        if (topic) {
          query.where(
            'articles.topic', topic
          )
        }
      });
  }
}
exports.selectArticlesCount = ({
  author,
  topic
}) => {
  return connection
    .count({
      total_count: '*'
    })
    .from('articles')
    .modify((query) => {
      if (author) {
        query.where(
          'articles.author', author
        )
      }
      if (topic) {
        query.where(
          'articles.topic', topic
        )
      }
    }).first();
}
exports.selectArticle = (
  article_id
) => {
  if (!isValidId(article_id)) {
    return Promise.reject({
      status: 400,
      message: 'Invalid article id'
    })
  } else {
    return connection.select('articles.*')
      .count({
        comment_count: 'comment_id'
      })
      .from('articles')
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .where('articles.article_id', article_id)
      .groupBy('articles.article_id')
      .first()
      .returning('*');
  }
}
//single articles
exports.updateArticle = (body, {
  article_id
}) => {
  const {
    inc_votes
  } = body;
  if (!isValidId(article_id)) {
    return Promise.reject({
      status: 400,
      message: 'Invalid article_id'
    })
  } else if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      message: 'inc_votes missing',
    });
  } else if (!isValidVoteIncrement(inc_votes)) {
    return Promise.reject({
      status: 400,
      message: 'votes should be whole numbers'
    })
  } else {
    return connection('articles')
      .where({
        article_id: parseInt(article_id)
      })
      .increment('votes', inc_votes)
      .returning('*');
  }
}
exports.insertArticle = (article) => {
  const requiredKeys = { author: "", title: "", body: "", topic: "" };
  if (!hasAllKeys(requiredKeys, article)) {
    return Promise.reject({ status: 400, message: "articles must have author, title, body and topic fields" })
  }
  else {
    const { author, title, body, topic } = article;
    return connection('articles')
      .insert({
        author,
        title,
        body,
        topic
      })
      .returning('*');
  }

}

