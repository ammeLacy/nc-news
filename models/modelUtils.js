exports.isValidVoteIncrement = (inc_votes) => {
  return /^-?\d+$/.test(inc_votes);
}

exports.isValidArticleId = (article_id) => {
  return /^\d+$/.test(article_id);
}

// exports.hasAllKeys = Object.keys(obj1).every((key) => {
//   return Object.prototype.hasOwnProperty.call(obj2, key);
// });

exports.hasAllKeys = (object1, object2) => {
  return Object.keys(object1).every((key) => {
    return Object.prototype.hasOwnProperty.call(object2, key)
  })

}
