const {
  insertComment,
  selectComments,
  updateComment
} = require('../models/commentsModels.js');

const {
  selectArticle
} = require('../models/articlesModels.js');

exports.postComment = (req, res, next) => {
  selectArticle(parseInt(parseInt(req.params.article_id)))
    .then(article => {
      if (article === undefined) {
        res.status(404).send()
      } else insertComment(req.body, req.params)
        .then(comment => {
          res.status(201).send({
            comment: comment[0]
          })
        }).catch(err => next(err));
    })
}



exports.getComments = (req, res, next) => {
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
        if (comments.length === 0) {
          selectArticle(parseInt(req.params.article_id))
            .then(
              article => {
                if (article === undefined) {
                  res.status(404).send();
                } else {
                  res.status(200).send({
                    comments: []
                  })
                }
              }
            )
        } else {
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
        }
      }).catch(err => next(err))

  }
}

exports.patchComment = (req, res, next) => {
  if (req.body.inc_votes !== undefined && !Number.isInteger(req.body.inc_votes)) {
    res.status(400).send({
      message: 'votes should be whole numbers'
    })
  } else {
    updateComment(req.body, req.params)
      .then(comment => {
        if (comment.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send({
            comment: comment[0]
          })
        }
      }).catch(err => next(err));
  }
}
