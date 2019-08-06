const commentsRouter = require('express').Router({
  mergeParams: true
});

const {
  postComment,
  getComments,
  patchComment,
  removeComment
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
  .delete(removeComment)
  .all(send405Error)


module.exports = commentsRouter;
