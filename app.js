const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')
const {
  routeError,
  SQLerrors,
  serverError
} = require('./errors/errors.js');

//insert JSON
app.use(express.json());

//Routes
app.use('/api', apiRouter);

//Error handling
app.use(SQLerrors)
app.use(serverError);
app.all('/*', routeError);


module.exports = app;
