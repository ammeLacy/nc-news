const connection = require('../db/connection.js');

//TO DO refactor to handle queries and filters
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
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id').orderBy(sort_by, order)
}

// author which is the username from the users table - done
// title - done
// article_id done 
// topic
// created_at
// votes
// comment_count which is the total count of all the comments with this article_id - you should make use of knex queries in order to ac

exports.selectArticle = (
  article_id
) => {
  //console.log("inside select article model");
  //console.log(article_id, '---------------------------')
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
