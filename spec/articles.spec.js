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
      it('returns  200 and an array of article objects, each of which has an author, title, article_id, topic, created_at, votes and comment_count keys, ', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles).to.be.a("array");
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
      it('returns 200 and comment count key that returns the number of comments for each article', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[3]).to.include.key('comment_count');
            expect(parseInt(articles[3].comment_count)).to.equal(0);
          })
      });
      it('returns 200 and articles sorted by DEFAULT SORT ORDER CREATED_AT and DESCENDING as the DEFAULT ORDER ', () => {
        return request(app)
          .get('/api/articles')
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
      it('returns 200 and articles sorted by field specified in the query string and DEFAULT ORDER', () => {
        const queries = ['author', 'title', 'article_id', 'topic', 'votes', 'comment_count'];
        const queriedFields = queries.map(query => {
          return request(app)
            .get(`/api/articles?sort_by=${query}`)
            .expect(200)
            .then(({
              body: {
                articles
              }
            }) => {
              expect(articles).to.be.sortedBy(query, {
                descending: true
              });
              return Promise.all(queriedFields);
            })
        })
      });
      it('returns 200 articles sorted by field specified in the query string ASCENDING', () => {
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
      it('returns 200 and all the articles for a given author if the author exists with the DEFAULT SORT_BY and ORDER_BY', () => {
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
            expect(articles).to.be.sortedBy('created_at', {
              descending: true
            });
          })
      });
      it('returns 200 and all the articles for a given author if the author exists for a given topic if the topic exists, ASCENDING', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge&topic=mitch&order=asc')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.every(article => article.author === 'butter_bridge')).to.equal(true);
            expect(articles.every(article => article.topic === 'mitch')).to.equal(true);
            expect(articles).to.be.sortedBy('created_at');
          })
      });
      it('returns 200 and all articles for a given topic if the topic exists with the DEFAULT SORT_BY and ORDER_BY', () => {
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
            expect(articles).to.be.sortedBy('created_at', {
              descending: true
            });
          })
      });
      it('returns 200 DEFAULT SORT_BY and ORDER_BY and DEFAULT of 10 articles per page', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.length).to.equal(10);
          })
      });
      it('returns 200 DEFAULT SORT_BY and ORDER_BY and number of articles specified in the query', () => {
        return request(app)
          .get('/api/articles?limit=5')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.length).to.equal(5);
          })

      });
      it('returns 200 all articles for a given author and topic (if they exist), in ascending order with a user specified limit', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge&topic=mitch&order=asc&limit=2')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles.every(article => article.author === 'butter_bridge')).to.equal(true);
            expect(articles.every(article => article.topic === 'mitch')).to.equal(true);
            expect(articles).to.be.sortedBy('created_at');
            expect(articles.length).to.equal(2);
          })
      });
      it('returns 200 a total_count property displaying the total number of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              total_count
            }
          }) => {
            expect(total_count).to.equal(15);
          })

      });
      it('returns 200 and total_count property for author filter - total count of articles by that author', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({
            body: {
              total_count
            }
          }) => {
            expect(total_count).to.equal(3);
          })
      });
      it('returns 200 and total count property for topic filter - total count of articles for that topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .then(({
            body: {
              total_count
            }
          }) => {
            expect(total_count).to.equal(11);
          })
      });
      it('returns 200 and total count property for combined author and topic queries - total_count of articles written by an author on a topic', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge&topic=mitch')
          .expect(200)
          .then(({
            body: {
              total_count
            }
          }) => {
            expect(total_count).to.equal(3);
          })
      });
      it('returns 200 and DEFAULTS to the first page when no page number is specified - DEFAULT SORT_BY, DEFAULT ORDER, DEFAULT LIMIT', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[0].title).to.equal('Living in the shadow of a great man');
            expect(articles[9].title).to.equal('Seven inspirational thought leaders from Manchester UK');
          })
      });
      it('returns 200 and displays any articles for the page specified, DEFAULT SORT_BY, DEFAULT ORDER, DEFAULT LIMIT', () => {
        return request(app)
          .get('/api/articles?p=2')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[0].title).to.equal('Am I a cat?');
            expect(articles[articles.length - 1].title).to.equal('Moustache');
          })
      });
      it('returns 200, displays the articles for page specified, with a specified SORT_BY, ORDER is ascending, topic and author filters are applied and a custom limit is specified', () => {
        return request(app)
          .get('/api/articles?author=icellusedkars&topic=mitch&order=asc&sort_by=title&p=2&limit=2')
          .expect(200)
          .then(({
            body: {
              articles
            }
          }) => {
            expect(articles[0].title).to.equal('Does Mitch predate civilisation?');
            expect(articles[1].title).to.equal('Eight pug gifs that remind me of mitch');
            expect(articles).to.be.sortedBy('title');
            expect(articles.every(article => article.author === 'icellusedkars'));
            expect(articles.every(article => article.topic === 'mitch'));
            expect(articles.length).equals(2);
          })
      });
      it('returns 404 when a non existant author is given', () => {
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
        it('returns 200 and DEFFAULT SORT ORDER of CREATED_AT when passed an none-existent column to query by', () => {
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
        it('returns 200 if passed an invalid order for displaying the articles and defaults to descending', () => {
          return request(app)
            .get('/api/articles?order=up')
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
        it('returns 400 and a message if passed an invalid limt - floating point numbers', () => {
          return request(app)
            .get('/api/articles?limit=1.5')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('limit should be whole numbers');
            })
        });
        it('returns 400 and a message if passed an invalid limit - negative numbers', () => {
          return request(app)
            .get('/api/articles?limit=-1')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('limit should be whole numbers')
            })
        });
        it('returns 400 and a message if passed an invalid limit - string', () => {
          return request(app)
            .get('/api/articles?limit=a')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('limit should be whole numbers');
            })
        });
        it('returns 400 and a message if passed an invalid page number - floating point numbers', () => {
          return request(app)
            .get('/api/articles?p=0.5')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('page numbers should be whole numbers')
            })
        });
        it('returns 400 and a message if passed an invalid page number - negative number', () => {
          return request(app)
            .get('/api/articles?p=-1')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('page numbers should be whole numbers')
            })
        });
        it('returns 400 and a message if passed an invalid page number - string', () => {
          return request(app)
            .get('/api/articles?p=a')
            .expect(400)
            .then(({
              body: {
                message
              }
            }) => {
              expect(message).to.equal('page numbers should be whole numbers')
            })
        });
        it('returns 404 when given an incorrect path', () => {
          return request(app)
            .get('/api/article')
            .expect(404);
        });
      });
    });
    describe('POST', () => {
      it('returns 201 and the created artice', () => {
        return request(app)
          .post('/api/articles')
          .send({
            "author": "butter_bridge",
            "title": "trees",
            "body": "Lorem impsom",
            "topic": "mitch",
          })
          .expect(201)
      });
    });
  });
  describe('INVALID METHODS', () => {
    it('status:405', () => {
      const invalidMethods = ['put', 'delete', 'patch'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)[method]('/api/articles')
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
describe('/articles/:article_id ', () => {
  beforeEach(() => connection.seed.run());
  describe('GET', () => {
    it('takes an article id, returns 200 and an article object ', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article).to.be.a('object');
        })

    });
    it('takes an article id, returns 200 and an article object including keys author(username), article_id, body, topic, created_at, votes', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article).to.include.keys(
            'author',
            'title',
            'body',
            'topic',
            'created_at',
            'votes')
        })
    });
    it('returns 200 and a comment count key that returns the number of comments for the given article', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article).to.include.key('comment_count');
          expect(article.comment_count).to.equal(13);
        })
    });
    it('returns 200 and vote column is set to 0 as a default', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({
          body: {
            article: {
              votes
            }
          }
        }) => {
          expect(votes).to.equal(0);
        })
    });
    it('returns 404 for a requested article that does not exist', () => {
      return request(app)
        .get('/api/articles/999')
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
            expect(article.article_id).to.equal(1);
          })
      });
      it('returns 400 when given an invalid format for the article_id - 1a', () => {
        return request(app)
          .get('/api/articles/1a')
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).to.equal('Invalid article id');
          })
      });
      it('returns 400 when given an invalid format for the article_id - 1.5', () => {
        return request(app)
          .get('/api/articles/1.5')
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).to.equal('Invalid article id')
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
    it('takes an object in the form { inc_votes: newVote }, increases the vote by the positive amount given, returns 200 the updated object', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({
          "inc_votes": 1
        })
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article).to.be.a("object");
          expect(article).to.eql({
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
          body: {
            article: {
              votes
            }
          }
        }) => {
          expect(votes).to.equal(99);
        })
    });
    it('returns 404 for a none existent article id', () => {
      return request(app)
        .patch('/api/articles/1000')
        .send({
          "inc_votes": 1
        })
        .expect(404);
    });
    describe('ERRORS', () => {
      it('returns 200 and article, and updated vote count when passed an query string in addition to the vote count', () => {
        return request(app)
          .patch('/api/articles/1?sortby=article_id')
          .send({
            "inc_votes": 1
          })
          .expect(200)
          .then(({
            body: {
              article
            }
          }) => {
            expect(article).to.eql({
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
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).to.equal('Invalid article_id')
          })
      });
      it('returns 400 and error message when given a number of votes outside of the range of integer', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            "inc_votes": 9223372036854775807
          })
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {

            expect(message).to.equal('value "9223372036854776000" is out of range for type integer');
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
            body: {
              message
            }
          }) => {
            expect(message).to.eql('votes should be whole numbers');
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
            body: {
              message
            }
          }) => {
            expect(message).to.equal('inc_votes missing');
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
            body: {
              message
            }
          }) => {
            expect(message).to.equal('votes should be whole numbers')
          })
      });
      it('returns 400 when passed a request with no body', () => {
        return request(app)
          .patch('/api/articles/1')
          .expect(400)
          .then(({
            body: (({
              message
            }) => {
              expect(message).to.equal('column "undefined" does not exist')
            })
          }))
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
  describe('INVALID METHODS', () => {
    it('status:405', () => {
      const invalidMethods = ['put', 'delete', 'post'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)[method]('/api/articles/1')
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
