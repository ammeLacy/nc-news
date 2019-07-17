const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')

//Dont forget to add error hanndling 
app.use(express.json());
app.use('/api', apiRouter);
module.exports = app;
