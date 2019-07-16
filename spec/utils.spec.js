const {
  expect
} = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

//exports.formatDates = list => {};

describe('formatDates', () => {
  it('returns an empty array when list is undefined', () => {
    const actual = formatDates(undefined);
    expect(actual).to.eql([]);

  });
  it('returns a new empty array when passed an empty array', () => {
    const actual = formatDates([]);
    expect(actual).to.not.equal([]);
    expect(actual).to.eql([]);
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
