const commentsRouter = require('express').Router({
  mergeParams: true
});

const {
  postComment,
  getComments,
  patchComment
} = require('../controllers/commentsControllers.js');


const {
  send405Error
} = require('../errors/errors.js');

//multiple comments 
commentsRouter
  .route('/')
  .post(postComment)
  .get(getComments)
  .all(send405Error)

//Single comments
commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .all(send405Error)
// amend to so can do delete

module.exports = commentsRouter;
