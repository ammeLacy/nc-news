const topicsRouter = require('express').Router();
const {
  sendTopics
} = require('../controllers/topicControllers.js');

topicsRouter.route('/').get(sendTopics);

module.exports = topicsRouter;
