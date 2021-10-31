import jwt from "jsonwebtoken";
import config from "../config";
import createError from "http-errors";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

export default (req, res, next) => {
  // Get token from header
  const token = req.header("token");
  // Check if not token
  if (!token) {
    next(createError(statusCode.BAD_REQUEST,responseMessage.NO_TOKEN))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    res.locals.tokenValue = token;
    res.locals.userId = decoded.sub;
    next();
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        next(createError(statusCode.UNAUTHORIZED,responseMessage.EXPIRED_TOKEN));
        break;
      case 'JsonWebTokenError':
        next(createError(statusCode.UNAUTHORIZED,responseMessage.INVALID_TOKEN));
        break;
    }
  }
};