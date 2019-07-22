const {
  selectUser,
} = require('../models/usersModels.js');


//modify to be sendUsers - see notes will need to alter the model as well
exports.sendUser = (req, res, next) => {
  //console.log('inside User controller');
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
