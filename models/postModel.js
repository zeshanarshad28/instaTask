const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    imgURL: {
      type: String,
      required: [true, "Please enter img url"],
      trim: true,
    },
    caption: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
