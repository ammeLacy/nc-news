const {
  selectTopics,
} = require('../models/topicModels.js');


exports.sendTopics = (req, res, next) => {
  console.log(' ** inside topicController');
  selectTopics()
    .then(topicsArray => {
      const topics = {
        topics: topicsArray
      };
      //console.log(topics)
      res.status(200).send({
        topics
      })
    })
    .catch(err => next(err));

}
