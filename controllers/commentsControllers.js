const {
  insertComment
} = require('../models/commentsModels.js');

exports.postComment = (req, res, next) => {
  console.log('inside postComments controller')
  insertComment(req.body, req.params)
}
