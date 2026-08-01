const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  //todo Headers
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  //todo Token
  const token = authHeaders.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findById(payload.id).select('-password');
    // req.user = user;

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
