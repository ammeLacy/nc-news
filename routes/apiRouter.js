const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles/:article_id/comments', commentsRouter);
apiRouter.use('/comments/:comment_id', commentsRouter)
apiRouter.use('/articles', articlesRouter);
module.exports = apiRouter;
