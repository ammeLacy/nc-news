const connection = require('../db/connection.js');

//TO DO refactor to handle obtaining multiple articles
exports.selectArticle = (article_id) => {
  //console.log('inside selectArticle model');
  return connection.select('articles.*')
    .count({
      comment_count: 'comment_id'
    })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id.article_id)
    .groupBy('articles.article_id');
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

// exports.updateTreasure = (body, {
//   treasure_id
// }) => {
//   return connection('treasures')
//     .where({
//       treasure_id
//     })
//     .update(body)
//     .returning('*')
//     .then(rowArray => {
//       if (rowArray.length === 0) {
//         return Promise.reject({
//           status: 404,
//           msg: "not found"
//         })
//       } else {
//         return rowArray;
//       }
//     })
