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
  describe('/articles', () => {
    describe('GET', () => {
      it('responds  200 and an array of article objects, each of which has an author, title, article_id, topic, created_at, votes and comment_count keys, ', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[articles.length - 1]).to.include.keys(
              'author',
              'title',
              'topic',
              'created_at',
              'votes')
            expect(articles[0]).to.include.keys('author',
              'title',
              'topic',
              'created_at',
              'votes');
          })
      });
      it('returns a comment count key that returns the number of comments for each article', () => {
        return request(app)
          .get('/api/articles')
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[14]).to.include.key('comment_count');
            expect(parseInt(articles[14].comment_count)).to.equal(0);
          })
      });
      it('returns articles sorted by date (created_at) as the default sort order and descending as the default order ', () => {
        return request(app)
          .get('/api/articles')
          .then(({
            body: (({
              articles
            }) => {
              expect(articles).to.be.sortedBy('created_at'), {
                descending: true
              }
            })
          }))
      });
      it('returns articles sorted by field specified in the query string descending', () => {
        const queries = ['author', 'title', 'article_id', 'topic', 'votes', 'comment_count'];
        const queriedFields = queries.map(query => {
          return request(app)
            .get(`/api/articles?sort_by=${query}`)
            .expect(200)
            .then(({
              body: {
                article
              }
            }) => {
              expect(article).to.be.sortedBy(query, {
                descending: true
              });
              return Promise.all(queriedFields);
            })
        })
      });
      it('returns articles sorted by field specified in the query string ascending', () => {
        const queries = ['author', 'title', 'article_id', 'topic', 'votes', 'comment_count'];
        const queriedFields = queries.map(query => {
          return request(app)
            .get(`/api/articles?sort_by=${query}&order=asc`)
            .expect(200)
            .then(({
              body: {
                articles
              }
            }) => {
              expect(articles).to.be.sortedBy(query);
              return Promise.all(queriedFields);
            })
        })
      })
      it('returns 200 and all the articles for a given author if the author exists', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.every(article => article.author === 'butter_bridge')).to.equal(true);
            expect(!articles.includes('icellusedkars')).to.equal(true);
          })
      });
      it('returns 200 and all articles for a given topic if the topic exists', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.every(article => article.topic === 'mitch')).to.equal(true);
            expect(!articles.includes('cats')).to.equal(true);
          })
      });
      it('returns 404 when a non existant username is given', () => {
        return request(app)
          .get('/api/articles?author=butter_bridger')
          .expect(404);
      });
      it('returns 404 when a none existant topic is given ', () => {
        return request(app)
          .get('/api/articles?topic=trees')
          .expect(404);
      });
      describe('ERRORS', () => {
        it('returns 200 and default sort order of created_at when passed an invalid column to query by', () => {
          return request(app)
            .get('/api/articles?sort_by=body')
            .expect(200)
            .then(({
              body: (({
                articles
              }) => {
                expect(articles).to.be.sortedBy('created_at'), {
                  descending: true
                }
              })
            }))
        });
        it('returns 400 and error message if passed an invalid order for displaying the articles', () => {
          return request(app)
            .get('/api/articles?order=up')
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.message).to.equal('invalid sort order')
            })
        });
        it('returns 404 when given an incorrect path', () => {
          return request(app)
            .get('/api/article')
            .expect(404);
        });
      });
      describe('INVALID METHODS', () => {
        it('status:405', () => {
          const invalidMethods = ['post', 'put', 'delete']; // remove post 
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api/articles')
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
describe('/articles/:article_id ', () => {
  describe('GET', () => {
    it('takes an article id, returns 200 and an article object including keys author(username), article_id, body, topic, created_at, votes', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article[0]).to.include.keys(
            'author',
            'title',
            'body',
            'topic',
            'created_at',
            'votes')
        })
    });
    it('returns a comment count key that returns the number of comments for the given article', () => {
      return request(app)
        .get('/api/articles/1')
        .then(({
          body: {
            article
          }
        }) => {
          expect(article[0]).to.include.key('comment_count');
          expect(parseInt(article[0].comment_count)).to.equal(12);
        })
    });
    it('returns 404 for a requested article that does not exist', () => {
      return request(app)
        .get('/api/articles/99999')
        .expect(404);
    });
    describe('ERRORS', () => {
      it('returns 200 and the requested article when also passed a query in the request', () => {
        return request(app)
          .get('/api/articles/1?greatArticle=true')
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article[0].article_id).to.equal(1);
          })
      });
      it('returns 400 when given an invalid format for the article_id - 1a', () => {
        return request(app)
          .get('/api/articles/1a')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.message).to.equal('Invalid article id');
          })
      });
      it('returns 400 when given an invalid format for the article_id - 1.5', () => {
        return request(app)
          .get('/api/articles/1.5')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.message).to.equal('Invalid article id')
          })
      });
      it('returns 404 when given an incorrect path', () => {
        return request(app)
          .get('/api/article/1.5')
          .expect(404)
      });
    });
  });
  describe('PATCH', () => {
    it('takes an object in the form { inc_votes: newVote }, increases the vote by the positive amount given, and returns the updated object', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({
          "inc_votes": 1
        })
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.article[0]).to.eql({
            "article_id": 1,
            "author": "butter_bridge",
            "title": "Living in the shadow of a great man",
            "body": "I find this existence challenging",
            "topic": "mitch",
            "created_at": "2018-11-15T12:21:54.171Z",
            "votes": 101,
          })
        });
    });
    it('takes an object in the form { inc_votes: newVote }, decreases the vote by the negative amount given, and returns the updated object', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({
          "inc_votes": -1
        })
        .then(({
          body
        }) => {
          expect(body.article[0].votes).to.equal(100);
        })
    });
    it('returns 404 for a none existent article id', () => {
      return request(app)
        .patch('/api/articles/9999')
        .send({
          "inc_votes": 1
        })
        .expect(404);
    });
    describe('ERRORS', () => {
      it('returns 200 and article, and updated vote count when passed an query string in addition to the vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            "inc_votes": 1
          })
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.article[0]).to.eql({
              "article_id": 1,
              "author": "butter_bridge",
              "title": "Living in the shadow of a great man",
              "body": "I find this existence challenging",
              "topic": "mitch",
              "created_at": "2018-11-15T12:21:54.171Z",
              "votes": 101,
            })
          });
      });
      it('returns 400 when passed an incorrect article_id format', () => {
        return request(app)
          .patch('/api/articles/1a')
          .send({
            "inc_votes": 1
          })
          .expect(400);
      });
      it('returns 400 and error message when given a number of votes outside of the range of integer', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            "inc_votes": 99999999999999
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.message).to.equal('integer out of range');
          })
      });
      it('returns 400 when passed an invalid value is sent to increase the vote count', () => {
        return request(app)
          .patch('/api/articles/1')
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
      it('returns 400 when passed an incorrect column to update in the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            "inc_vote": 1
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.message).to.equal('column "undefined" does not exist');
          })
      });
      it('returns 400 when passed a floating point number to update the vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            "inc_votes": 1.5
          })
          .expect(400)

          .then(({
            body
          }) => {
            expect(body.message).to.equal('votes should be whole numbers')
          })
      });
      it('returns 404 when passed an incorrect path', () => {
        return request(app)
          .patch('/api/article/1')
          .send({
            "inc_votes": 1
          })
          .expect(404);
      });
    });
  });
  // describe('DELETE', () => {
  //   describe('ERRORS', () => {

  //   });
  // });
  describe('INVALID METHODS', () => {
    //test will need updating to allow delete
    it('status:405', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)[method]('/api/articles/1')
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
