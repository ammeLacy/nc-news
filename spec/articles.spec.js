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
    describe.only('GET', () => {
      it('should take an article id, and return an article object with keys author(username), article_id, body, topic, created_at, votes, comments_count', () => {
        request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article).to.have.all.keys(
              'author',
              'title',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count')
          })
      });
    });

  });
});
