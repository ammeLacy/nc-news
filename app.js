const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')
const {
  routeError,
} = require('./errors/errors.js')



app.use(express.json());

//Routes
app.use('/api', apiRouter);
//Error handling
app.all('/*', routeError);

module.exports = app;
