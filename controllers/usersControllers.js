let User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appError");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const signToken = (id) => {
  return jwt.sign({ id }, "qwertyuiopasdfghjklzxcvbnmqwerty", {
    expiresIn: "1d",
  });
};
const creatSendToken = (user, statusCode, res) => {
  console.log("in creatSendToken");
  const token = signToken(user._id);
  // defining a cookie -
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true, // cookie can not modify by browser
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // by secure=true cookie only send on encrypted connection like HTTPS
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; /// hide the password to show in response
  console.log(user);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
// =========SIGNUP USER=====================
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,

    passwordChangedAt: req.body.passwordChangedAt,
  });

  creatSendToken(newUser, 201, res);
});

//     Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppErr("please provide email and password", 400));
  }
  // check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppErr("Incorrect email or password", 401));
  }

  creatSendToken(user, 200, res);
});
