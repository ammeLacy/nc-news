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
            body
          }) => {
            expect(body.topics.topics[0]).to.have.all.keys(
              'slug',
              'description',
            );
          })
      });
    });

  });

});
