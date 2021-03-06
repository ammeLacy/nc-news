const {
  insertComment,
  selectComments,
  updateComment,
  deleteComment
} = require('../models/commentsModels.js');

const {
  selectArticle
} = require('../models/articlesModels.js');

exports.postComment = (req, res, next) => {
  selectArticle(parseInt(req.params.article_id))
    .then(article => {
      if (article === undefined) {
        res.status(404).send();
      } else {
        insertComment(req.body, req.params)
          .then(comment => {
            res.status(201).send({
              comment: comment[0]
            })
          }).catch(err => next(err));
      }
    }).catch(err => next(err));
}

exports.getComments = (req, res, next) => {
  selectComments(req.params, req.query)
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

exports.patchComment = (req, res, next) => {

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

exports.removeComment = (req, res, next) => {
  deleteComment(req.params)
    .then(deletedRow => {
      if (deletedRow === 0) {
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    }).catch(err => next(err))


}
