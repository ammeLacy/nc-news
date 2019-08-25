const articlesRouter = require('express').Router();

const {
  sendArticle,
  sendArticles,
  patchArticle,
  postArticle
} = require('../controllers/articlesControllers.js');

const {
  send405Error
} = require('../errors/errors.js');

//All articles
articlesRouter
  .route('')
  .get(sendArticles)
  .post(postArticle)
  .all(send405Error);

//Single article
articlesRouter
  .route('/:article_id')
  .get(sendArticle)
  .patch(patchArticle)
  .all(send405Error);



module.exports = articlesRouter;
