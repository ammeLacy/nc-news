const {
  insertComment
} = require('../models/commentsModels.js');

exports.postComment = (req, res, next) => {
  console.log('inside postComments controller');
  //console.log(req)
  // console.log(req.body)
  insertComment(req.body, req.params)
    .then(comment => {
      res.status(201).send({
        comment
      })
    }).catch(next);
}
