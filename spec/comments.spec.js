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
            expect(comments).to.be.a("array");
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
      it('returns 200 and comments sorted by DEFAULT SORT ORDER CREATED_AT and DESCENDING as the DEFAULT ORDER', () => {
        return request(app)
          .get('/api/articles/15/comments')
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
      it('returns 200 comments sorted by field specified in the query string and DEFAULT ORDER', () => {
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
      it('returns 200 comments sorted by field specified in the query string ASCENDING', () => {
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
              return Promise.all(queriedFields)
            })
        })
      });
      it('returns 200 and a DEFAULT LIMIT of 10 comments per valid specified article, DEFAULT SORT ORDER, DEFAULT ORDER_BY', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments.length).to.equal(10);
            expect(comments).to.be.sortedBy('created_at', {
              descending: true
            });
          })
      })
      it('returns 200 and a user specified limit of articles, DEFAULT SORT ORDER, DEFAULT ORDER_BY ', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5 ')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments.length).to.equal(5);
            expect(comments).to.be.sortedBy('created_at', {
              descending: true
            })
          })
      });
      it('returns 200, user specified sort_order in ascending order, with a user specified limit  ', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author&order=asc&limit=3')
          .expect(200)
          .then(({
            body: {
              comments
            }
          }) => {
            expect(comments).to.be.sortedBy('author');
            expect(comments.length).to.equal(3);
          })
      });
    });
    it('returns 404 when given a valid format article id for an article that does not exist', () => {
      return request(app)
        .get('/api/articles/1000/comments')
        .expect(404);
    });
    describe('ERRORS', () => {
      it('returns 200 and and default sort order of created_at when passed an invalid column to query by', () => {
        return request(app)
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
      it('returns 200 and if passed an invalid order for displaying the comments and defaults to descending', () => {
        return request(app)
          .get('/api/articles/15/comments?order=up')
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
    it('accepts an object with the following properties:username body and returns 201 and the posted comment', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          "username": "butter_bridge",
          "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        })
        .expect(201)
        .then(({
          body: {
            comment
          }
        }) => {
          expect(comment).to.include.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at'
          )
          expect(comment).to.be.a("object");
          expect(comment.author).to.equal('butter_bridge');
          expect(comment.body).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
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
            body: {
              comment
            }
          }) => {
            expect(comment.body).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
          })
      });
      it('returns 404 if a none existent valid article-id is sent', () => {
        return request(app)
          .post('/api/articles/99999/comments')
          .send({
            "username": "butter_bridge",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          })
          .expect(404);
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
            body: {
              message
            }
          }) => {
            expect(message).to.equal('author does not exist');
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
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)[method]('/api/articles/1/comments')
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


describe('/api', () => {
  beforeEach(() => connection.seed.run());
  describe('/api/comments/:comment_id', () => {
    describe('PATCH', () => {
      it('takes an object in the form { inc_votes: newVote }, increases the vote by the positive amount given, and returns the updated object', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({
            "inc_votes": 1
          })
          .expect(200)
          .then(
            ({
              body: {
                comment
              }
            }) => {
              expect(comment).to.be.a("object");
              expect(comment).to.eql({
                "comment_id": 1,
                "author": "butter_bridge",
                "article_id": 9,
                "votes": 17,
                "created_at": "2017-11-22T12:36:03.389Z",
                "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              })
            }
          );
      });
      it('takes an object in the form { inc_votes: newVote }, decreases the vote by the negative amount given, and returns the updated object', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({
            "inc_votes": -1
          })
          .expect(200)
          .then(
            ({
              body: {
                comment
              }
            }) => {
              expect(comment).to.eql({
                'comment_id': 2,
                'author': 'butter_bridge',
                'article_id': 1,
                'votes': 13,
                'created_at': '2016-11-22T12:36:03.389Z',
                'body': "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              })
            })
      });
      it('returns 404 for a none existent comment_id', () => {
        return request(app)
          .patch('/api/comments/99999')
          .send({
            "inc_votes": 1
          })
          .expect(404);
      });
      describe('ERRORS', () => {
        it('returns 200 and article, and updated vote count when passed an query string in addition to the vote count', () => {
          return request(app)
            .patch('/api/comments/2?sortby=author')
            .send({
              "inc_votes": 2
            })
            .expect(200)
            .then(({
              body: {
                comment
              }
            }) => {
              expect(comment).to.eql({
                'comment_id': 2,
                'author': 'butter_bridge',
                'article_id': 1,
                'votes': 16,
                'created_at': '2016-11-22T12:36:03.389Z',
                'body': "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              })
            })
        });
        it('returns 400 when passed an incorrect comment_id format', () => {
          return request(app)
            .patch('/api/comments/3a')
            .send({
              "inc_votes": 2
            })
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('Invalid comment_id')
            })
        });
        it('returns 400 and error message when the number of votes is outside the range of an integer', () => {
          return request(app)
            .patch('/api/comments/3')
            .send({
              "inc_votes": 99999999999999
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('value "99999999999999" is out of range for type integer');
            })
        });
        it('returns 400 when passed an invalid value to increase the vote count', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              "inc_votes": "a"
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.eql('votes should be whole numbers');
            })
        });
        it('returns 400 when passed a floating point number to update the vote count', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              "inc_votes": 2.5
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('votes should be whole numbers')
            })
        })
        it('returns 400 when passed an incorrect column to update in request body', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              "inc_vote": "2"
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.eql('inc_votes missing')
            })
        });
        it('returns 404 when passed an an incorrect path', () => {
          return request(app)
            .patch('/api/comment/1')
            .send({
              "inc_votes": 1
            })
            .expect(404);
        });
      })
    })
    describe('DELETE', () => {
      it('returns 204 status when given a valid comment_id to delete and if sent the request again returns 404', () => {
        return request(app)
          .delete('/api/comments/20')
          .expect(204)
          .then(ensureItemDeleted => {
            return request(app)
              .delete('/api/comments/20')
              .expect(404);
          })
      });
      it('returns 404 when given a valid but none existant comment_id', () => {
        return request(app)
          .delete('/api/comments/21')
          .expect(404);
      });
      describe('ERRORS', () => {
        it('returns 204 and deletes comment if sent a query with the delete request', () => {
          return request(app)
            .delete('/api/comments/5?sortby=created_at')
            .expect(204)
            .then(ensureItemDeleted => {
              return request(app)
                .delete('/api/comments/5?sortby=created_at')
                .expect(404)
            })
        });
        it('returns 400 if given a invalid comment_id', () => {
          return request(app)
            .delete('/api/comments/1a/')
            .expect(400);
        });
        it('returns 404 if given an invalid route', () => {
          return request(app)
            .delete('/api/comment/1')
            .expect(404);
        });
      });
    });
  })
});
describe('INVALID METHODS', () => {
  it('status:405', () => {
    const invalidMethods = ['put', 'get', 'post'];
    const methodPromises = invalidMethods.map((method) => {
      return request(app)[method]('/api/comments/1')
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
