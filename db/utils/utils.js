exports.formatDates = list => {
  if (list === undefined) {
    return [];
  } else {
    return list.map(item => {
      let timestamp = item.created_at;
      let formattedDate = new Date(timestamp);
      let {
        created_at,
        ...otherFields
      } = item;
      created_at = formattedDate;
      return {
        ...otherFields,
        created_at
      };
    })
  }

};

exports.makeRefObj = (list, key, val) => {
  if (list === undefined) {
    return [];
  } else {
    const lookupObj = {};
    list.forEach(item => {
      lookupObj[item[key]] = item[val];
    })
    return lookupObj;
  };
}

exports.formatComments = (comments, articleRef) => {
  if (comments === undefined || articleRef === undefined) {
    return [];
  } else {
    const newLocal = this.formatDates(comments).map(comment => {
      const {
        created_by,
        belongs_to,
        ...restOfFields
      } = comment;
      return {
        author: comment.created_by,
        article_id: articleRef[belongs_to],
        ...restOfFields
      };
    });
    //console.log(newLocal);
    return newLocal;
  }



}
