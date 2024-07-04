import {
  sendDevelopmentError,
  duplicationError,
  sendProductionError
} from "#controllers/error.controller.js";

const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || `error`;
  if (process.env.NODE_ENV === `development`) {
    return sendDevelopmentError(err, res);
  }
  let error = { ...err };
  error.message = err.message;
  // console.log(error);
  // console.log(err.message);
  if (err.code === 11000) error = duplicationError(error);
  return sendProductionError(error, res);
};
export default handleError;
