const {
  selectArticle,
  selectArticles,
  updateArticle
} = require('../models/articlesModels.js');

exports.sendArticle = (req, res, next) => {
  //console.log('inside send article controller');
  //console.log(req.params.article_id, '-------------------------')
  if (req.params.article_id !== undefined && !/^\d+$/.test(req.params.article_id)) {
    //console.log('Isnt an integer ==============================');
    res.status(400).send({
      message: 'Invalid article id'
    })
  } else {
    selectArticle(parseInt(req.params.article_id))
      .then(article => {
        if (article.length === 0) {
          res.status(404).send();
        } else {
          console.log(article)
          res.status(200).send({
            article
          })
        }
      }).catch(err => next(err));
  }
}

exports.sendArticles = (req, res, next) => {
  // console.log('inside sendArticle controller');
  //console.log(req.query)
  selectArticles(
      req.query
    )
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
  //console.log(req.body.inc_votes)
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
