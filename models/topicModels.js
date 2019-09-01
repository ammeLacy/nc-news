const connection = require('../db/connection.js');
const {
  isValidArticleId,
} = require('./modelUtils.js');

exports.selectTopics = ({ limit = 3, sort_by }) => {
  if (limit !== undefined && !isValidArticleId(limit)) {
    return Promise.reject({
      status: 400,
      message: "limit must be an integer"
    })
  }
  else {
    const parsedLimit = parseInt(limit);
    if (sort_by !== 'article_count') {
      return connection.select('*')
        .limit(parsedLimit)
        .from('topics');
    }
    else {
      return connection.select('topics.slug')
        .count(
          'article_id as article_count'
        )
        .from('topics')
        .leftJoin('articles', 'topics.slug', 'articles.topic')
        .groupBy('topics.slug')
        .orderBy('article_count', 'desc')
        .limit(parsedLimit)
    }
  }
}

exports.insertTopic = (body) => {
  const { slug, description } = body;
  if (slug === undefined && description === undefined) {
    return Promise.reject({
      status: 400,
      message: "slug and description must not be null"
    })
  }
  else if (slug === undefined) {
    return Promise.reject({
      status: 400,
      message: "slug must not be null"
    })
  }
  else if (description === undefined) {
    return Promise.reject({
      status: 400,
      message: "description must not be null"
    })
  }
  else {
    return connection('topics')
      .insert({
        slug,
        description
      })
      .returning('*')
  }
}

