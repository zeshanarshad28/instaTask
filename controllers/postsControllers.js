const { response } = require("../app");
let Post = require("../models/postModel");

exports.getPost = catchAsync(async (req, res, next) => {
  const url =
    "  https://crypto.price.libonomy.ai/v1/cryptocurrency/quotes/latest?symbol=PSIX";
  const apiData = await axios.get(url, {
    params: {},
  });
  res.status(res.statusCode).json({
    status: "success",
  });
});
