const topicsRouter = require('express').Router();
const {
  sendTopics,
  postTopic
} = require('../controllers/topicControllers.js');

const {
  send405Error
} = require('../errors/errors.js');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(postTopic)
  .all(send405Error);

module.exports = topicsRouter;
