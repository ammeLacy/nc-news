const {
  selectArticles,
  updateArticle
} = require('../models/articlesModels.js');

exports.sendArticles = (req, res, next) => {
  // console.log('inside sendArticle controller');
  console.log(req.query)
  selectArticles({
      ...req.params,
      ...req.query
    })
    .then(article => {
      if (article.length === 0) {
        res.status(404).send();
      } else {
        res.status(200).send({
          article
        })
      }
    })
    .catch(err => next(err));
}

exports.patchArticle = (req, res, next) => {
  //console.log('inside patch Article controller');
  console.log(req.body.inc_votes)
  if (req.body.inc_votes !== undefined && !Number.isInteger(req.body.inc_votes)) {
    res.status(400).send({
      message: 'votes should be whole numbers'
    })
  } else {
    updateArticle(req.body, req.params)
      .then(article => {
        if (article.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send({
            article
          })
        }
      }).catch(next);
  }
}
