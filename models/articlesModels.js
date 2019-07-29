const connection = require('../db/connection.js');


// ``
// `js
// // ./models/films.js
// exports.getFilms = ({ limit, film_id }) => {
//   return connection
//     .select('*')
//     .from('films')
//     .limit(limit || 10)
//     .modify((query) => {
//       if (film_id) query.where({ film_id }).first();
//     });
// };
// `

//TO DO refactor to handle  filters
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
