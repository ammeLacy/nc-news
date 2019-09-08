exports.isValidVoteIncrement = (inc_votes) => {
  return /^-?\d+$/.test(inc_votes);
}

exports.isValidId = (id) => {
  return /^\d+$/.test(id);
}

exports.hasAllKeys = (object1, object2) => {
  return Object.keys(object1).every((key) => {
    return Object.prototype.hasOwnProperty.call(object2, key)
  })

}
