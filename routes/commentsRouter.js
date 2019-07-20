const commentsRouter = require('express').Router({
  mergeParams: true
});

const {
  postComment,
  getComments
} = require('../controllers/commentsControllers.js');


commentsRouter
  .route('/')
  .post(postComment)
  .get(getComments)

module.exports = commentsRouter;
