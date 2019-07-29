const {
  selectArticle,
  selectArticles,
  updateArticle
} = require('../models/articlesModels.js');

exports.sendArticle = (req, res, next) => {
  //console.log('inside send article controller');
  //console.log(req.params.article_id, '-------------------------')
  if (req.params.article_id !== undefined && !/^\d+$/.test(req.params.article_id)) {
    //console.log('Isnt an integer ==============================');
    res.status(400).send({
      message: 'Invalid article id'
    })
  } else {
    selectArticle(parseInt(req.params.article_id))
      .then(article => {
        if (article.length === 0) {
          res.status(404).send();
        } else {
          console.log(article)
          res.status(200).send({
            article
          })
        }
      }).catch(err => next(err));
  }
}

exports.sendArticles = (req, res, next) => {
  // console.log('inside sendArticle controller');
  if (req.query.order !== 'asc' && req.query.order !== 'desc' && req.query.order !== undefined) {
    res.status(400).send({
      message: 'invalid sort order'
    })
  } else {
    let {
      sort_by,
      order,
      author,
      topic
    } = req.query;
    const permittedQueries = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
    let ordering = {
      order
    };
    if (permittedQueries.includes(sort_by)) {
      ordering.sort_by = sort_by;
    } else {
      ordering.sort_by = 'created_at';
    }
    // if req.query === author
    selectArticles(
        ordering
      )
      .then(article => {
        if (article.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send({
            article
          })
        }
      })
      .catch(err => next(err));
  }
}


exports.patchArticle = (req, res, next) => {
  //console.log('inside patch Article controller');
  //console.log(req.body.inc_votes)
  if (req.body.inc_votes !== undefined && !Number.isInteger(req.body.inc_votes)) {
    res.status(400).send({
      message: 'votes should be whole numbers'
    })
  } else {
    updateArticle(req.body, req.params)
      .then(article => {
        if (article.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send({
            article
          })
        }
      }).catch(next);
  }
}
