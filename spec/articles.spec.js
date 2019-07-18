process.env.NODE_ENV = "test";

//requirments
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe.only('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/articles/:article_id', () => {
    describe('GET', () => {
      it('should take an article id, and return an article including keys author(username), article_id, body, topic, created_at, votes', () => {
        request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article[0]).to.include.keys(
              'author',
              'title',
              'body',
              'topic',
              'created_at',
              'votes')
          })
      });
      it('should return a comment count key that returns the number of comments for an article', () => {
        request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article[0]).to.include.key('comment_count');
            expect(parseInt(article[0].comment_count)).to.equal(13);
          })
      });
    });
    it('should return 404 for a requested article that does not exist', () => {
      request(app)
        .get('api/articles/99999')
        .expect(404);
    });

  });
});
