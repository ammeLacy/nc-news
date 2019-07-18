const usersRouter = require('express').Router();

const {
  sendUser
} = require('../controllers/usersControllers.js');

const {
  send405Error
} = require('../errors/errors.js');

usersRouter
  .route('/:username')
  .get(sendUser)
  .all(send405Error);


module.exports = usersRouter;
