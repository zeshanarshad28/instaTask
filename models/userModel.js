const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AppErr = require("../utils/appError");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "must enter email"],
      //   lowercase: true,
      validate: [validator.isEmail, "please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "must enter password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords not matched",
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  //only run this function if password id actually modified
  if (!this.isModified("password")) return next();
  // password validation using Regex

  var passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{5,14}$/;
  if (!this.password.match(passwordPattern)) {
    next(
      new AppErr(
        "Password is invalid! it should be atleast 8 characters,start with character and contains symbols."
      )
    );
  }
  // Hash the password with cost
  this.password = await bcrypt.hash(this.password, 12);
  // remove(stop) the confirmPassword to store in db. require means necessary to input not to save in db.
  this.confirmPassword = undefined;
  next();
});

// password Tester
userSchema.methods.correctPassword = async function (
  passwordByUser,
  passwordInDb
) {
  return await bcrypt.compare(passwordByUser, passwordInDb);
};

// ========method to protect routes verifies all about token

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
