const {
  selectArticle,
  selectArticles,
  selectArticlesCount,
  updateArticle
} = require('../models/articlesModels.js');

exports.sendArticle = (req, res, next) => {
  selectArticle(req.params.article_id)
    .then(article => {
      if (article === undefined) {
        res.status(404).send();
      } else {
        res.status(200).send({
          article
        })
      }
    }).catch(err => next(err));
}

exports.sendArticles = (req, res, next) => {
  let total_count = 0;
  const promisedCounts = selectArticlesCount(req.query).then(counts => {
    if (counts !== undefined) {
      total_count = counts.total_count;
    }
  }).then(
    selectArticles(
      req.query
    )
    .then(articles => {
      if (articles.length === 0) {
        res.status(404).send();
      } else {
        res.status(200).send({
          total_count,
          articles
        })
      }
    }).catch(err => next(err))
  ).catch(err => next(err));
}


exports.patchArticle = (req, res, next) => {
  updateArticle(req.body, req.params)
    .then(article => {
      if (article.length === 0) {
        res.status(404).send();
      } else {
        res.status(200).send({
          article: article[0]
        })
      }
    }).catch(err => next(err));
}
