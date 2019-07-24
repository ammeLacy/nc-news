const connection = require('../db/connection.js');


//TO DO refactor to handle queries and filters
exports.selectArticles = ({
    article_id
  },
  sort_by = 'created_at',
  order = 'desc'
) => {
  // console.log('===============================')
  // console.log(article_id)
  // console.log(sort_by)
  return connection.select('articles.*')
    .count({
      comment_count: 'comment_id'
    })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id').orderBy(sort_by, order)
    .modify((query) => {
      if (article_id) query.where('articles.article_id', article_id).first
    })
}


// // ./models/films.js
// exports.getFilms = ({
//   limit,
//   film_id
// }) => {
//   return connection
//     .select('*')
//     .from('films')
//     .limit(limit || 10)
//     .modify((query) => {
//       if (film_id) query.where({
//         film_id
//       }).first();
//     });
// };

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
