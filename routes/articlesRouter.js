const articlesRouter = require('express').Router();
const {
  sendArticle
} = require('../controllers/articlesControllers.js');
const {
  send405Error
} = require('../errors/errors.js');

// amend to so can do patch/ delete
articlesRouter
  .route('/:article_id')
  .get(sendArticle)
  .all(send405Error);



module.exports = articlesRouter;
