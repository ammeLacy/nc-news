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
    //parametise this [1, 3, 99, 1000]
    const actual = isValidVoteIncrement(1);
    expect(actual).to.equal(true);
  });
  it('returns false when given an invalid vote format', () => { // parametise this ['a','"1",'1a','1.5', '/','\','?','@','&','#','(',')','{,'}','^','~','£','$',' ','+','-','_','!','*','%];
    const actual = isValidVoteIncrement('a');
    expect(actual).to.equal(false);
  });
});

describe('isValidArticleId', () => {
  it('returns true when given a valid articleId', () => {
    //paremetisation [1, 3, 9, 999]
    const actual = isValidArticleId(1);
    expect(actual).to.equal(true);
  });
  it('returns ralse when given an invali article_Id', () => {
    const actual = isValidArticleId("a");
    expect(actual).to.equal(false);
  });
});
