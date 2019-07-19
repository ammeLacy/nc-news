const {
  selectArticle,
  updateArticle
} = require('../models/articlesModels.js');

exports.sendArticle = (req, res, next) => {
  //console.log('inside sendArticle controller');
  selectArticle(req.params)
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