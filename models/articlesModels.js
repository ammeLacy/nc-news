const connection = require('../db/connection.js');

//TO DO refactor to handle  filters
exports.selectArticles = ({
  sort_by = 'created_at',
  order = 'desc'
}) => {
  // console.log('===============================')
  // console.log(article_id)
  // console.log(sort_by)
  return connection.select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
    .count({
      comment_count: 'comment_id'
    })
    .from('articles') //articles.author, author 
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id').orderBy(sort_by, order)
}

exports.selectArticle = (
  article_id
) => {
  //console.log("inside select article model");
  return connection.select('articles.*')
    .count({
      comment_count: 'comment_id'
    })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .returning('*');
}



exports.updateArticle = (body, {
  article_id
}) => {
  return connection('articles')
    .where({
      article_id
    })
    .update({
      votes: connection.raw('votes + ' + body.inc_votes)
    })
    .returning('*');
}
