const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appError");
// ===========================VERIFY TOKEN BEFORE GETTING DATA=====================
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  console.log("verifying token....");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppErr("You are not logged in , please login to get access", 401)
    );
  }

  // Verification of  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if the user still exist

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppErr("User not exist now", 401));
  }
  // console.log("User exist step 3.");

  //check if the user changed the password after the token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppErr("User recently changed password please login again!", 401)
    );
  }
  //grant access to the protected rout
  req.user = currentUser;
  // console.log(currentUser);
  console.log("verification completed");
  next();
});
