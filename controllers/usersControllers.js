const {
  selectUser,
} = require('../models/usersModels.js');

exports.sendUser = (req, res, next) => {
  selectUser(req.params)
    .then(user => {
      if (user === undefined) {
        res.status(404).send();
      } else {
        res.status(200).send({
          user
        })
      }
    })
    .catch(err => next(err));
}
