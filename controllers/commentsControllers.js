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
  //console.log(req.query.order)
  if (req.query.order !== 'asc' && req.query.order !== 'desc' && req.query.order !== undefined) {
    res.status(400).send({
      message: 'invalid sort order'
    })
  } else {
    let {
      sort_by,
      order
    } = req.query;
    const permittedQueries = ['comment_id', 'votes', 'created_at', 'author', 'body'];

    let ordering = {
      order
    };
    if (permittedQueries.includes(sort_by)) {
      ordering.sort_by = sort_by;
    } else {
      ordering.sort_by = 'created_at';
    }

    selectComments(req.params, ordering)
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
}
