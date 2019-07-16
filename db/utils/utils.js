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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

// let timestamp = singleArticle[0].created_at;
// let formattedDate = new Date(timestamp);
// console.log(formattedDate);

/*
 [{
     title: 'Living in the shadow of a great man',
     topic: 'mitch',
     author: 'butter_bridge',
     body: 'I find this existence challenging',
     created_at: 1542284514171,
     votes: 100,
   },
   */
