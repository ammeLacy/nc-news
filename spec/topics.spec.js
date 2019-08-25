process.env.NODE_ENV = "test";
const connection = require('../db/connection.js');
const chai = require('chai');
chai.use(require("chai-sorted"));
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/topics', () => {
    describe('/GET', () => {
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

      });
      describe('/POST', () => {
        it('it returns 201 and the created topic', () => {
          return request(app)
            .post('/api/topics')
            .send({
              "slug": "butter_bridge",
              "description": "Lorem ipsum dolor"
            })
            .expect(201)
            .then(({
              body: {
                topic
              }
            }) => {
              expect(topic.slug).to.equal('butter_bridge');
              expect(topic.description).to.equal('Lorem ipsum dolor');
            })
        });
        describe('ERRORS', () => {
          it('returns 201 and the created article if passed a query string in the post request', () => {
            return request(app)
              .post('/api/topics?popular')
              .send({
                "slug": "butter_bridge",
                "description": "Lorem ipsum dolor"
              })
              .expect(201)
              .then(({
                body: {
                  topic
                }
              }) => {
                expect(topic.slug).to.equal('butter_bridge');
                expect(topic.description).to.equal('Lorem ipsum dolor');
              })
          });
          it('returns 400 and an error message if the body does not include a slug', () => {
            return request(app)
              .post('/api/topics')
              .send({
                "description": "Lorem ipsum dolor"
              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal("slug must not be null");
              })
          });
          it('returns 400 and an error message if the body does not include a description', () => {
            return request(app)
              .post('/api/topics')
              .send({
                "slug": "butter_bridge"
              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal("description must not be null");
              })
          });
          it('returns 400 an an error message if slug and description are undefined', () => {
            return request(app)
              .post('/api/topics')
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal("slug and description must not be null")
              })
          });
          it('returns 400 and an error message if slug is misspelt', () => {
            request(app)
              .post('/api/topics')
              .send({
                "slu": "butter_bridge",
                "description": "Lorem ipsum"
              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal('slug must not be null');
              })
          });
          it('returns 400 and error message if description is  misspelt', () => {
            request(app)
              .post('/api/topics')
              .send({
                "slug": "butter_bridge",
                "descriptio": "Lorem ipsum dolore"
              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal('description must not be null');
              })
          });
          it('returns 400 and an error message if sent a post request with no body ', () => {
            return request(app)
              .post('/api/topics')
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal('slug and description must not be null')
              })
          });
          it('returns 400 and an error message if sent a slug longer than 255 characters long', () => {
            return request(app)
              .post('/api/topics')
              .send({
                "slug": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis magna nisi, sed consectetur dui tincidunt et. Nullam sed libero ante. Praesent non risus elit. In efficitur erat vel enim dictum, vitae ornare eros finibus. In hac habitasse platea dictumst. Sed sollicitudin facilisis luctus. Vestibulum ullamcorper semper orci eget imperdiet. Aenean eu augue blandit,",
                "description": "Lorem impsum dolor"

              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal('value too long for type character')
              })
          });
          it('returns 400 and and an error message if sent a description longer than 255 characters long', () => {
            return request(app)
              .post('/api/topics')
              .send({
                "slug": "butter_bridge",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis magna nisi, sed consectetur dui tincidunt et. Nullam sed libero ante. Praesent non risus elit. In efficitur erat vel enim dictum, vitae ornare eros finibus. In hac habitasse platea dictumst. Sed sollicitudin facilisis luctus. Vestibulum ullamcorper semper orci eget imperdiet. Aenean eu augue blandit,"
              })
              .expect(400)
              .then(({
                body: {
                  message
                }
              }) => {
                expect(message).to.equal('value too long for type character');
              })
          });
          it('returns 400 and an error message if sent duplicate slugs', () => {
            return request(app)
              .post('/api/topics')
              .send({
                "slug": "butter_bridge",
                "description": "Lorem ipsum"
              })
              .expect(201);
          });
          return request(app)
            .post('/api/topics')
            .send({
              "slug": "butter_bridge",
              "description": "Nullam sed"
            })
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
            })
        });
      });
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
