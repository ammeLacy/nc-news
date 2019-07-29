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
      it('returns 200 and an array of comments for the given article_id, each comment has a comment_id, votes, created_at, author and body key', () => {
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
          .get('/api/articles/14/comments')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments.length).to.equal(0);
          })
      });
      it('returns comments sorted by created_at as a default sort order and descending as the default order', () => {
        return request(app)
          .get('/api/articles/15/comments')
          .send()
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments).to.be.sortedBy('created_at', {
              descending: true
            });
          })
      });
      it('returns comments sorted by field specified in the query string descending', () => {
        const queries = ['comment_id', 'votes', 'created_at', 'author', 'body'];
        const queriedFields = queries.map(query => {
          return request(app)
            .get(`/api/articles/15/comments?sort_by=${query}`)
            .expect(200)
            .then(({
              body: {
                comments
              }
            }) => {
              expect(comments).to.be.sortedBy(query, {
                descending: true
              });
              return Promise.all(queriedFields);
            })
        })
      });
      it('returns comments sorted by field specified in the query string ascending', () => {
        const queries = ['comment_id', 'votes', 'created_at', 'author', 'body'];
        const queriedFields = queries.map(query => {
          return request(app)
            .get(`/api/articles/15/comments?sort_by=${query}&order=asc`)
            .expect(200)
            .then(({
              body: {
                comments
              }
            }) => {
              expect(comments).to.be.sortedBy(query);
              return Promise.all(queriedFields);
            })
        })
      });
      describe('ERRORS', () => {
        it('returns 200 and and default sort order of created_at when passed an invalid column to query by', () => {
          return request(app) //?sort_by=body
            .get('/api/articles/15/comments?sort_by=invalid_query')
            .expect(200)
            .then(({
              body: {
                comments
              }
            }) => {
              expect(comments).to.be.sortedBy('created_at', {
                descending: true
              });
            })
        });
        it('returns 200 and ignores additional queries passed in and returns the contents of the first queries if they are valid', () => {
          return request(app)
            .get('/api/articles/15/comments?sort_by=author&sort_by=createdat&order=asc')
            .expect(200)
            .then(({
              body: {
                comments
              }
            }) => {
              expect(comments).to.be.sortedBy('author');
            })
        });
        it('returns 400 and error message if passed an invalid order for displaying the comments', () => {
          return request(app)
            .get('/api/articles/15/comments?order=up')
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('invalid sort order')
            })
        });
        it('returns 400 if an invalid format for the article-id is sent', () => {
          return request(app)
            .get('/api/articles/1a/comments')
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('invalid input syntax for integer: "1a"');
            })
        });
        it('returns 404 if an invalid route is sent', () => {
          return request(app)
            .get('/api/articles/1/comment')
            .expect(404);
        });
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
      it('able to accept a long comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            "username": "butter_bridge",
            "body": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis magna nisi, sed consectetur dui tincidunt et. Nullam sed libero ante. Praesent non risus elit. In efficitur erat vel enim dictum, vitae ornare eros finibus. In hac habitasse platea dictumst. Sed sollicitudin facilisis luctus. Vestibulum ullamcorper semper orci eget imperdiet. Aenean eu augue blandit, malesuada lectus et, efficitur sapien. Donec imperdiet diam sem, vel rhoncus nulla vehicula ac. Sed sit amet diam pulvinar, pulvinar nunc non, dignissim libero. Quisque a dui tempor, porttitor elit non, iaculis enim. Aliquam iaculis est vel eros lacinia, non consequat libero maximus. Vestibulum ut sapien dolor. Suspendisse vitae lobortis massa. In magna mi, venenatis vitae neque eu, interdum tempor ex. Duis finibus est vitae justo aliquet accumsan.

            Ut vitae rutrum erat, ac lobortis quam. Cras vel volutpat sem. Nulla pellentesque a sapien sed vestibulum. Quisque posuere a tortor nec fringilla. Ut a nunc ut neque tincidunt sollicitudin. Ut egestas imperdiet pulvinar. Nullam leo orci, ullamcorper at dictum sit amet, ornare vel est. Nunc semper fringilla libero at pretium. Cras a vulputate nulla, eget eleifend arcu. Donec vitae ex dui. Praesent lobortis porttitor sapien.`
          })
          .expect(201);
      });

      describe('ERRORS', () => {
        it('ignores query string and returns 201 and created comment if passed a query string', () => {
          return request(app)
            .post('/api/articles/1/comments?sort_by=created_at')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(201)
            .then(({
              body
            }) => {
              expect(body.comment[0].body).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            })
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
        it('returns 400 if an invalid article-id is sent', () => {
          return request(app)
            .post('/api/articles/1a/comments')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('invalid input syntax for integer: "1a"')
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
        it('returns 400 if the username is longer than 255 characters', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              "username": `Curabitur placerat maximus condimentum. Nullam id enim ligula. Phasellus eu dignissim velit, et condimentum mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras ultricies malesuada urna, ut tempus sem feugiat sit amet. Duis id felis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras et libero a lorem mattis dictum non sed dui. Duis in lacus eget est vestibulum maximus. Mauris ante dolor, eleifend vel pulvinar eget, tincidunt ut leo.",`,
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('value too long for type character');
            })
        });
        it('returns 404 if an invalid route is sent', () => {
          return request(app)
            .post('/api/articles/1/comment')
            .send({
              "username": "butter_bridge",
              "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            })
            .expect(404);
        });
      });
    });
    describe('INVALID ROUTES', () => {
      it('status:405', () => {
        const invalidMethods = ['put', 'delete']; // will need amending to allow delete 
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/articles/1/comments')
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
