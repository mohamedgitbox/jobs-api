const User = require("../models/UserModel");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs/dist/bcrypt");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  console.log(user);

  res
    .status(StatusCodes.CREATED)
    .json({ user: { userId: user._id, name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.createJWT();

  if (!await user.comparePassword(password)) {
    throw new UnauthenticatedError("Invalid credentials (password)");
  }
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
