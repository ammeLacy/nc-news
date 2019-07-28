const articlesRouter = require('express').Router();

const {
  sendArticle,
  sendArticles,
  patchArticle
} = require('../controllers/articlesControllers.js');


const {
  send405Error
} = require('../errors/errors.js');

//All articles
articlesRouter
  .route('')
  .get(sendArticles)
  .all(send405Error);

// amend to so can do delete
//Single article
articlesRouter
  .route('/:article_id')
  .get(sendArticle)
  .patch(patchArticle)
  .all(send405Error);





module.exports = articlesRouter;
