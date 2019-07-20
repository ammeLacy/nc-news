process.env.NODE_ENV = "test";

//requires
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');


describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/articles/article_id/comments', () => {
    describe('GET', () => {
      it('returns 200 an array of comments for the given article_id, each comment has a comment_id, votes, created_at, author and body key', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments[0]).to.have.all.keys(
              'comment_id', 'votes', 'created_at', 'author', 'body');
          })
      });
      it('returns 200 and an empty array for an article with no comments', () => {
        return request(app)
          .get('/api/articles/13/comments')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments.length).to.equal(0);
          })
      });
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
        it('returns 404 if an invalid route is sent', () => {
          return request(app)
            .post('/api/articles/1/comment')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(404);
        });
        it('returns 400 if a none existent article-id is sent', () => {
          return request(app)
            .post('/api/articles/99999/comments')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.eql('article does not exist');
            })
        });
        it('returns 400 if a none-existent username is sent ', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              "username": "kathy",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('author does not exist');
            })
        });
        it('returns 400 if a username is not sent in the request body', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('username must not be null');
            })
        });
        it('returns 400 if a body is not not sent in the request body', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              "username": "butter_bridge"
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('body must not be null');
            })
        });
        it('returns 400 if username and body are not sent in the request body', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({})
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('username and body must not be null');
            })
        });
      });
    });
  });
});
