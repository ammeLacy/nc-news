process.env.NODE_ENV = "test";

//requirments
const {
  expect
} = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

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

describe('makeRefObj', () => {
  it('returns an empty array when list is undefined', () => {
    const actual = makeRefObj(undefined);
    expect(actual).to.eql([]);
  });
  it('returns an new empty object when passed an empty array', () => {
    const actual = makeRefObj([]);
    expect(actual).to.eql({});
  });
  it('returns a new lookup object when passed a single element array', () => {
    const article = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
      article_id: 1
    }];
    const key = 'title';
    const value = 'article_id';
    const actual = makeRefObj(article, key, value);
    expect(actual['Living in the shadow of a great man']).to.equal(1);
    expect(article[0]).to.have.all.keys('title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_id');
    expect(article[0]).to.not.include.key('Living in the shadow of a great man');
  });
  it('returns a new lookup object with multiple keys when passed an array of greater than length 1', () => {
    const article = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
      article_id: 1
    }, {
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: 1289996514171,
      article_id: 2
    }];
    const key = 'title';
    const value = 'article_id';
    const actual = makeRefObj(article, key, value);
    expect(actual).to.have.all.keys('Living in the shadow of a great man', 'Eight pug gifs that remind me of mitch');
    expect(article[1]).to.not.include.key('Eight pug gifs that remind me of mitch');
  });
});

describe('formatComments', () => {
  it('returns an empty array when comments or articleRef is undefined', () => {
    const actual = formatComments(undefined, undefined);
    expect(actual).to.eql([]);
  });
  it('returns a new empty array if passed  an empty array', () => {
    const comments = [];
    const articleRef = {
      'Living in the shadow of a great man ': 1
    };
    const actual = formatComments(comments, articleRef);
    const result = [];
    expect(actual).to.eql(result);
    expect(actual).to.not.equal(comments);
  });
  it('returns a new object with a key of author for an array of length 1', () => {
    const singleComment = [{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "Living in the shadow of a great man",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const actual = formatComments(singleComment, '');
    expect(actual[0]).to.include.key('author');
    expect(actual[0]).to.not.include.key('belongs_to');
    expect(singleComment[0]).to.not.include.key('author');
    expect(singleComment[0]).to.include.key('belongs_to');
  });
  it('returns a new object with a key of author for an array more than length 1', () => {
    const multipleComments = [{
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "Living in the shadow of a great man",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      }
    ];
    const actual = formatComments(multipleComments, '');
    expect(actual[1]).to.include.key('author');
    expect(multipleComments[1]).to.not.include.key('author');

  });
  it('returns a new object with an article_id key corresponding to primary key in article when passed an array of length 1', () => {
    const singleComment = [{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "Living in the shadow of a great man",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const articleRef = {
      'Living in the shadow of a great man': 1
    }
    const actual = formatComments(singleComment, articleRef);
    expect(actual[0]).to.include.key('article_id');
  });
  it('returns an array of new objects with article_id keys corresponding to primary key in article when passed an array of more than length 1', () => {
    const multipleComments = [{
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "Living in the shadow of a great man",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'icellusedkars',
        votes: 16,
        created_at: 1101386163389,
      }
    ];
    const articleRef = {
      'Living in the shadow of a great man ': 1,
      'UNCOVERED: catspiracy to bring down democracy': 2
    };
    const actual = formatComments(multipleComments, articleRef);
    expect(actual[1]).to.include.key('article_id');
  });
});
