const cors = require('cors');
const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')


app.use(cors());

const {
  routeError,
  SQLerrors,
  customErrors,
  serverError,
  send405Error
} = require('./errors/errors.js');


//Insert JSON
app.use(express.json());

//Routes
app.use('/api', express.static(__dirname + '/public/endpoints.json'));
app.all('/api', send405Error);
app.use('/api', apiRouter);

//Error handling
app.use(SQLerrors);
app.use(customErrors);
app.use(serverError);
app.all('/*', routeError);

module.exports = app;
