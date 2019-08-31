const connection = require('../db/connection.js');

exports.selectTopics = ({ limit }) => {
  return connection.select('*')
    .limit(parseInt(limit))
    .from('topics');
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

