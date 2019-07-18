process.env.NODE_ENV = "test";

//requirements
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/users/:username', () => {
    describe('GET', () => {
      it('should take a username, and return a user object with username ,avatar_url name ', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({
            body: {
              user
            }
          }) => {
            expect(user).to.have.all.keys(
              'username',
              'avatar_url',
              'name');
          })
      });
      it('should return the users details corresponding with the  username', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({
            body: {
              user
            }
          }) => {
            expect(user.username).to.equal('butter_bridge');
            expect(user.name).to.equal('jonny');
            expect(user.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
          })
      });
      it('should return 404 when a username does not exist', () => {
        return request(app)
          .get('/api/users/none_existing_user')
          .expect(404)
      });
      describe('ERRORS', () => {
        it('returns 404 when given an incorrect path', () => {
          return request(app)
            .get('/api/user/butter_bridge')
            .expect(404);
        });
        it('returns the default page for a user when passed a valid username and query string', () => {
          return request(app)
            .get('/api/users/butter_bridge?greatUser=true')
            .expect(200)
            .then(({
              body: {
                user
              }
            }) => {
              expect(user.username).to.equal('butter_bridge');
              expect(user.name).to.equal('jonny');
              expect(user.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
            })
        });
        describe('INVALID METHODS', () => {
          it('status:405', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)[method]('/api/users/butter_bridge')
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
