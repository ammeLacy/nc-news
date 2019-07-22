const commentsRouter = require('express').Router({
  mergeParams: true
});

const {
  postComment,
  getComments
} = require('../controllers/commentsControllers.js');


const {
  send405Error
} = require('../errors/errors.js');

// amend to so can do delete
commentsRouter
  .route('/')
  .post(postComment)
  .get(getComments)
  .all(send405Error)


module.exports = commentsRouter;
