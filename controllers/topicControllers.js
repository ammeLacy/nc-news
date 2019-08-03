const {
  selectTopics,
} = require('../models/topicModels.js');


exports.sendTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({
        topics
      })
    })
    .catch(err => next(err));

}
