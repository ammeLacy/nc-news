process.env.NODE_ENV = "test";

//requires
const chai = require('chai');
const request = require('supertest');
const app = require('../app.js');
const expect = chai.expect;

describe('/api', () => {
  describe('GET', () => {
    it('returns 200 a list of all paths for nc_news', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).to.have.all.keys('GET /api', 'GET /api/articles', 'GET /api/articles/:article_id', 'PATCH /api/articles/:article_id', 'GET /api/articles/:article_id/comments', 'POST /api/articles/:article_id/comments', 'GET /api/topics', 'GET /users/:username ');
        })
    });
  });
});

describe('INVALID ROUTES', () => {
  it('status:405', () => {
    const invalidMethods = ['put', 'delete', 'post', 'patch'];
    const methodPromises = invalidMethods.map((method) => {
      return request(app)[method]('/api')
        .expect(405)
        .then(({
          body: {
            msg
          }
        }) => {
          expect(msg).to.equal('method not allowed');
        });
    });
    return Promise.all(methodPromises);
  });
});
