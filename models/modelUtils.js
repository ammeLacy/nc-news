exports.isValidVoteIncrement = (inc_votes) => {
  return /^-?\d+$/.test(inc_votes);
}

exports.isValidArticleId = (article_id) => {
  return /^\d+$/.test(article_id);
}
