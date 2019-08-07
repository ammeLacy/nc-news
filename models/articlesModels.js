const connection = require('../db/connection.js');
const {
  isValidArticleId,
  isValidVoteIncrement
} = require('./modelUtils.js');


exports.selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
  if (order !== 'asc') {
    order = 'desc'
  }
  const permittedQueries = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
  if (!permittedQueries.includes(sort_by)) {
    sort_by = 'created_at';
  }
  return connection.select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
    .count({
      comment_count: 'comment_id'
    })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id').orderBy(sort_by, order)
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


exports.selectArticle = (
  article_id
) => {
  if (!isValidArticleId(article_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid article id'
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


exports.updateArticle = (body, {
  article_id
}) => {
  const {
    inc_votes
  } = body;
  if (!isValidArticleId(article_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid article_id'
    })
  } else if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes missing',
    });
  } else if (!isValidVoteIncrement(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: 'votes should be whole numbers'
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
