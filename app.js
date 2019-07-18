const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')
const {
  routeError,
} = require('./errors/errors.js')

//Routes
app.use('/api', apiRouter);

//insert JSON
app.use(express.json());

//Error handling
app.all('/*', routeError);

module.exports = app;
