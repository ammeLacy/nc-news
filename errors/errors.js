exports.routeError = (req, res, next) => {
  //console.log('<<<<<<<< ROUTE ERROR')
  res.status(404).send();
}

exports.send405Error = (req, res, next) => {
  res.status(405).send({
    msg: 'method not allowed'
  });
};
