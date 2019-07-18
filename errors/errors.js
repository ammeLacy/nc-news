exports.routeError = (req, res, next) => {
  //console.log('<<<<<<<< ROUTE ERROR')
  res.status(404).send();
}

exports.SQLerrors = (err, req, res, next) => {
  console.log("<<<<<<<<< SQL ERRORS");
  //console.log(err);
  if (err.code) {
    const errCodes = {
      "22P02": err.message //	invalid_text_representation
    }

    res.status(400).send({
      message: errCodes[err.code].split(' - ')[1]
    });
  } else next(err);
}

exports.send405Error = (req, res, next) => {
  res.status(405).send({
    msg: 'method not allowed'
  });
};

exports.serverError = (err, req, res, next) => {
  console.log("<<<<<<< SERVER ERROR");
  console.log(err)
  res.status(500).send({
    msg: 'internal server error'
  });
}
