const connection = require('../db/connection.js');



exports.selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
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
    })
}


exports.selectArticle = (
  article_id
) => {
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


exports.updateArticle = (body, {
  article_id
}) => {
  const {
    inc_votes
  } = body;
  if (inc_votes !== undefined)
    return connection('articles')
      .where({
        article_id
      })
      .increment('votes', inc_votes)
      .returning('*');
  else {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes missing',
    });
  }
}
