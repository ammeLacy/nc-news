const articlesRouter = require('express').Router();

const {
  sendArticle
} = require('../controllers/articlesControllers.js');

articlesRouter.route('/:article_id').get(sendArticle)

// usersRouter
//   .route('/:username')
//   .get(sendUser)
//   .all(send405Error);


module.exports = articlesRouter;
