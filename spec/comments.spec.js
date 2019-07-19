process.env.NODE_ENV = "test";

//requires
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');


describe.only('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/comments', () => {
    describe('GET', () => {
      describe('ERRORS', () => {

      });
    });
    describe('POST', () => {
      it('accepts an object with the following properties:username body and returns the posted comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            "username": "butter_bridge",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          })
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.comment[0]).to.include.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at'
            )
            expect(body.comment[0].author).to.equal('butter_bridge');
            expect(body.comment[0].body).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
          })
      });
      describe('ERRORS', () => {

      });
    });

  });
});
