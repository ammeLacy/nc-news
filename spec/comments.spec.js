process.env.NODE_ENV = "test";
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe('Name of the group', () => {
  beforeEach(() => connection.seed.run());
  describe('/api', () => {
    describe('/comments', () => {
      describe('GET', () => {
        describe('ERRORs', () => {

        });
      });
      describe('POST', () => {
        it('accepts an object with the following properties:username body and returns the posted comment', () => {
          return request(app)
            .post('/api/articles/1')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(201)
            .then(({
              body
            }) => {
              expect(body.comment[0]).to.eql({
                'comment_id': 19,
                'author': 'butter_bridge',
                'article_id': 1,
                'votes': 100,
                'created_at': "2018-11-15T12:21:54.171Z"
              })
            })
        });
        describe('ERRORS', () => {

        });
      });
    });

  });
});

// return request(app)
//   .patch('/api/articles/1')
//   .send({
//     "inc_votes": 1
//   })
//   .expect(200)
//   .then(({
//     body
//   }) => {
//     expect(body.article[0]).to.eql({
//       "article_id": 1,
//       "author": "butter_bridge",
//       "title": "Living in the shadow of a great man",
//       "body": "I find this existence challenging",
//       "topic": "mitch",
//       "created_at": "2018-11-15T12:21:54.171Z",
//       "votes": 101,
//     })
//   });
// });
