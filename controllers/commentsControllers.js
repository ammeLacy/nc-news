const {
  insertComment,
  selectComments
} = require('../models/commentsModels.js');

exports.postComment = (req, res, next) => {
  //console.log('inside postComments controller');
  //console.log(req)
  // console.log(req.body)
  if (req.body.username === undefined && req.body.body === undefined) {
    res.status(400).send({
      message: 'username and body must not be null'
    })
  } else if (req.body.username === undefined) {
    res.status(400).send({
      message: 'username must not be null'
    });
  } else if (req.body.body === undefined) {
    res.status(400).send({
      message: 'body must not be null'
    })
  } else {
    insertComment(req.body, req.params)
      .then(comment => {
        res.status(201).send({
          comment
        })
      }).catch(next);
  }
}

exports.getComments = (req, res, next) => {
  //console.log('inside get Comments controller');
  //console.log(req.params)
  selectComments(req.params, req.query)
    .then(comments => {
      const alteredComments = comments.map(comment => {
        const {
          article_id,
          ...otherFields
        } = comment;
        return {
          ...otherFields
        };
      })
      res.status(200).send({
        comments: alteredComments
      })
    }).catch(next)
}
