process.env.NODE_ENV = "test";

//requirments
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/articles/:article_id', () => {
    describe('GET', () => {
      it('takes an article id, returns 200 and an article object including keys author(username), article_id, body, topic, created_at, votes', () => {
        return request(app)
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
      it('returns a comment count key that returns the number of comments for the given article', () => {
        return request(app)
          .get('/api/articles/1')
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
    it('returns 404 for a requested article that does not exist', () => {
      return request(app)
        .get('/api/articles/99999')
        .expect(404);
    });
    describe('ERRORS', () => {
      it('returns 404 when given an incorrect path', () => {
        return request(app)
          .get('/api/article/1')
          .expect(404);
      });
      it('returns 200 and the requested article when also passed a query in the request', () => {
        return request(app)
          .get('/api/articles/1?greatArticle=true')
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article[0].article_id).to.eql(1);
          })
      });
      it('returns 400 when given an invalid format for the article_id', () => {
        return request(app)
          .get('/api/articles/1a')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.message).to.eql('invalid input syntax for integer: "1a"');
          })

      });
      describe('INVALID ROUTES', () => {
        //test will need updating to allow patch and delete
        it('status:405', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api/articles/1')
              .expect(405)
              .then(({
                body: {
                  msg
                }
              }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          // methodPromises -> [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
