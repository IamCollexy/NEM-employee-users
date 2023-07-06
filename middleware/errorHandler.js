const { logEvent } = require('./logger');

//To Override the default express error handler

const errorHandler = (err, req, res, next) => {
  logEvent(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t$
{req.headers.origin}`,
    'errLog.txt'
  );
  console.error(err.stack);

  res.status(500).send(err.message);
};

module.exports = errorHandler;
