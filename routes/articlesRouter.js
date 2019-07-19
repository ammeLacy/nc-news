const articlesRouter = require('express').Router();

const {
  sendArticle,
  patchArticle
} = require('../controllers/articlesControllers.js');


const {
  send405Error
} = require('../errors/errors.js');

// amend to so can do delete
articlesRouter
  .route('/:article_id')
  .get(sendArticle)
  .patch(patchArticle)
  .all(send405Error);



module.exports = articlesRouter;
