import AppError from "#utils/appError.js";

export const sendDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
  });
};

export const sendProductionError = (err, res) => {
  // console.log(err.message);
  if (err.isOperational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  return res.status(500).json({
    status: "error",
    message: "Something went wrong"
  });
};

export const duplicationError = err => {
  const keys = Object.keys(err.keyValue);
  const message = `${keys[0]} already registered.`;
  return new AppError(400, message);
};
