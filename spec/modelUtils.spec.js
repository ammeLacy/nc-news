process.env.NODE_ENV = "test";
const {
  expect
} = require('chai');

//requires 
const {
  isValidVoteIncrement,
  isValidId,
  hasAllKeys
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

describe('isValidId', () => {
  it('returns true when given a valid articleId', () => {
    const actual = isValidId(1);
    expect(actual).to.equal(true);

    const validId = [1, 3, 9, 999];
    const result = [];
    validId.forEach(element => {
      if (isValidId(element)) {
        return (result.push(element))
      }
    });
    expect(result.length).to.equal(validId.length);
  });
  it('returns false when given an invalid article_Id', () => {
    const actual = isValidId("a");
    expect(actual).to.equal(false);
    const invalid_id = ['a', '1a', 1.5, -99, '/', '\\', '?', '@', '&', '#', '~', '(', ')', '{', '}', '^', '$', '+', '\'', '!', '*', '%'];
    const result = [];
    invalid_id.forEach(element => {
      if (isValidId(element)) {
        return (result.push(element));
      }
    });
    expect(result.length).to.equal(0);
  });

});

describe('hasAllKeys', () => {
  it('returns true when comparting keys of two objects each with one same key ', () => {
    const key1 = 'key1';
    const object1 = { key1 };
    const object2 = { key1 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(true);
  });
  it('returns false when comparing keys of two objects each with one different key ', () => {
    const object1 = { key1: 1 };
    const object2 = { key2: 1 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(false);
  });
  it('returns true when comparing keys of two objects each with multiple identical keys', () => {
    const object1 = { key1: 1, key2: 2 };
    const object2 = { key1: 1, key2: 2 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(true);
  });
  it('returns false when comparing keys of two objects with multiple unidentical keys', () => {
    const object1 = { key1: 1, key2: 2 };
    const object2 = { key3: 1, key4: 2 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(false);
  });
  it('returns false when comparing keys of two objects with a mix of idential and missing keys', () => {
    const object1 = { key1: 1, key2: 2 };
    const object2 = { key1: 1 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(false);
  });
  it('returns true when comparing keys of two objects and the second has additional keys to the first', () => {
    const object1 = { key1: 1, key2: 2 };
    const object2 = { key1: 1, key2: 2, key3: 3 };
    const actual = hasAllKeys(object1, object2);
    expect(actual).to.equal(true);
  });
});
