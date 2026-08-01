const { StatusCodes } = require("http-status-codes");
const { custom } = require("joi");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something Wrong try again later",
  };


  if (err.code === 11000) {
    customError.msg = `Duplicated value for ${Object.keys(err.keyValue)} field`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((val) => val.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found by id (${err.value})`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
