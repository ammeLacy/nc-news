exports.routeError = (req, res, next) => {
  //console.log('<<<<<<<< ROUTE ERROR')
  res.status(404).send();
}

exports.SQLerrors = (err, req, res, next) => {
  console.log("<<<<<<<<< SQL ERRORS");
  console.log(err.message);
  console.log(err.code)
  // console.log(err)
  if (err.code) {
    const errCodes = {
      42703: err.message, // column does not exist
      23502: err.message, //not_null_violation 
      23503: err.message, //foreign_key_violation
      22001: err.message, // string_data_right_truncation - data to long for field
      22003: err.message, // 	numeric_value_out_of_range
      "22P02": err.message //	invalid_text_representation
    }

    let message;
    if (err.code === '23503') {
      message = errCodes[err.code].split('constraint')[1].split('_')[1] + ' does not exist';
    } else if (err.code === '23502') {
      message = errCodes[err.code].split(' * ')[1].split('"')[1] + " cannot be null";
    } else if (err.code === '22001') {
      message = errCodes[err.code].split(' - ')[1].split(' varying')[0];
    } else if (err.code === 22003) {
      message = errCodes[err.code].split('value')[0]
    } else {
      message = errCodes[err.code].split(' - ')[1];
    }
    //else if (err.code === '42703' )
    res.status(400).send({
      message: message
    });
  } else next(err);
}

exports.send405Error = (req, res, next) => {
  res.status(405).send({
    msg: 'method not allowed'
  });
};

exports.customErrors = (err, req, res, next) => {
  console.log('customErrors')
  if (err.status) {
    res.status(err.status).send({
      message: err.msg
    });
  } else {
    next(err)
  }
}

exports.serverError = (err, req, res, next) => {
  console.log("<<<<<<< SERVER ERROR");
  console.log(err)
  res.status(500).send({
    msg: 'internal server error'
  });
}
