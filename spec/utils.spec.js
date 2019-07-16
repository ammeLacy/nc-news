process.env.NODE_ENV = "test";

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
  it('returns a new object with the date formatted for an array of a single item', () => {
    const singleArticle = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100
    }];
    const createdAt = singleArticle[0].created_at;
    let formattedDate = new Date(createdAt);
    const actual = formatDates(singleArticle);
    expect(actual[0].created_at).to.eql(formattedDate);
    expect(singleArticle[0].created_at).to.eql(1542284514171);
  });
  it('returns new objects with the date formatted for an array of more than 1 item', () => {
    const multipleArticles = [{
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: 911564514171,
      }, {
        title: 'Z',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'I was hungry.',
        created_at: 785420514171,
      }
    ];
    const createdAt1 = multipleArticles[1].created_at;
    const createdAt2 = multipleArticles[2].created_at;
    const formattedDate1 = new Date(createdAt1);
    const formattedDate2 = new Date(createdAt2);
    const actual = formatDates(multipleArticles);
    expect(actual[1].created_at).to.eql(formattedDate1);
    expect(actual[2].created_at).to.eql(formattedDate2);
    expect(multipleArticles[1].created_at).to.eql(911564514171);
    expect(multipleArticles[2].created_at).to.eql(785420514171);
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
