const commentsRouter = require('express').Router({
  mergeParams: true
});

const {
  postComment
} = require('../controllers/commentsControllers.js');


commentsRouter
  .route('/')
  .post(postComment)

module.exports = commentsRouter;
