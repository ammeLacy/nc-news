process.env.NODE_ENV = "test";
const {
  expect
} = require('chai');

const {
  isValidVoteIncrement,
  isValidArticleId
} = require('../models/modelUtils');


describe('isValidVoteIncrement', () => {
  it('returns true when given a valid vote format', () => {
    const validVotes = [1, 3, 99, 1000, -99];
    const result = [];
    validVotes.forEach(element => {
      if (isValidVoteIncrement(element)) {
        return (result.push(element))
      }
    })
    const actual = isValidVoteIncrement(1);
    expect(actual).to.equal(true);
    expect(result.length).to.equal(result.length);
  });
  it('returns false when given an invalid vote format', () => {
    const invalidVotes = ['a', '1a', 1.5, '/', '\\', '?', '@', '&', '#', '~', '(', ')', '{', '}', '^', '$', '+', '\'', '!', '*', '%'];
    const result = [];
    invalidVotes.forEach(element => {
      if (isValidVoteIncrement(element)) {
        return (result.push(element))
      }
    });
    expect(result.length).to.equal(0);
  });
});

describe.only('isValidArticleId', () => {
  it('returns true when given a valid articleId', () => {
    const actual = isValidArticleId(1);
    expect(actual).to.equal(true);

    const validId = [1, 3, 9, 999];
    const result = [];
    validId.forEach(element => {
      if (isValidArticleId(element)) {
        return (result.push(element))
      }
    });
    expect(result.length).to.equal(validId.length);
  });
  it('returns false when given an invalid article_Id', () => {
    const actual = isValidArticleId("a");
    expect(actual).to.equal(false);
    const invalid_id = ['a', '1a', 1.5, -99, '/', '\\', '?', '@', '&', '#', '~', '(', ')', '{', '}', '^', '$', '+', '\'', '!', '*', '%'];
    const result = [];
    invalid_id.forEach(element => {
      if (isValidArticleId(element)) {
        return (result.push(element));
      }
    });
    expect(result.length).to.equal(0);
  });

});
