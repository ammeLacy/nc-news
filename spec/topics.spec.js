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
            body: {
              topics
            }
          }) => {
            expect(topics).to.be.a('array')
          })
      });
      it('responds 200 with an array of topics that contain slug and description keys', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({
            body: {
              topics
            }
          }) => {
            expect(topics[0]).to.have.keys('slug', 'description');
          })

      });
      describe('ERRORS', () => {
        it('returns 200 and the default page when sent a query request', () => {
          return request(app)
            .get('/api/topics?greatTopic=true')
            .expect(200)
            .then(({
              body: {
                topics
              }
            }) => {
              expect(topics[0].slug).to.eql('mitch');
            })
        });
        it('returns 404 when given an incorrect path', () => {
          return request(app)
            .get('/api/invalid_topic_route')
            .expect(404);
        });
        describe('INVALID METHODS', () => {
          it('status:405', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)[method]('/api/topics')
                .expect(405)
                .then(({
                  body: {
                    message
                  }
                }) => {
                  expect(message).to.equal('method not allowed');
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
});
