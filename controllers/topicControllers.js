const {
  selectTopics,
  insertTopic
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


exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(topic => {
      res.status(201).send({
        topic: topic[0]
      })
    })
    .catch(err => next(err));
}

