const jwt = require("jsonwebtoken");
const { User } = require("../models");
const status = require("../helpers/Response");
const { ACCESS_SECRET } = process.env;

// ✅ Middleware: Check access token from cookies
exports.authCheck = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken && req.headers.authorization?.startsWith("Bearer ")) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return status.ResponseStatus(res, 401, "Access token required");
  }

  try {
    const payload = jwt.verify(accessToken, ACCESS_SECRET);
    req.session_data = payload;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return status.ResponseStatus(res, 401, "Access token expired");
    }
    return status.ResponseStatus(res, 401, "Invalid access token");
  }
};

// ✅ Middleware: Role-based access
exports.authRole = (roles = []) => {
  return async (req, res, next) => {
    const { session_data } = req;
    if (!session_data || !session_data.user_id) {
      return status.ResponseStatus(res, 401, "Unauthenticated");
    }

    try {
      const user = await User.findByPk(session_data.user_id);
      if (!user) {
        return status.ResponseStatus(res, 404, "User not found");
      }

      if (!roles.includes(user.role)) {
        return status.ResponseStatus(res, 403, "You don't have permission");
      }

      return next();
    } catch (err) {
      return status.ResponseStatus(res, 500, "Server error", {
        error: err.message,
      });
    }
  };
};
