process.env.NODE_ENV = "test";
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/GET', () => {
    describe('/topics', () => {
      it('responds 200 and an array of topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.topics.topics[0]).to.have.all.keys(
              'slug',
              'description',
            );
          })
      });
      describe('ERRORS', () => {
        it('returns 404 when given an incorrect path', () => {
          return request(app)
            .get('/api/invalid_topic_route')
            .expect(404);
        });
        it('returns the default page when sent a query request', () => {
          return request(app)
            .get('/api/topics?greatTopic=true')
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.topics.topics[0].slug).to.eql('mitch');
            })
        });
        describe('INVALID METHODS', () => {
          it('status:405', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)[method]('/api/topics')
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
});
