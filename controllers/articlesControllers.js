const {
  selectArticle,
} = require('../models/articlesModels.js');

exports.sendArticle = (req, res, next) => {
  console.log('inside sendArticle controller');
  selectArticle(req.params)
    .then(article => {

    }).catch(err => next(err));
}
