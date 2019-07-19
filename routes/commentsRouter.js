const commentsRouter = require('express').Router();

const {
  postComment
} = require('../controllers/commentsControllers.js');


commentsRouter
  .route('/comments')
  .get(postComment)

module.exports = commentsRouter;
