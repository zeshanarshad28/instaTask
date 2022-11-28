const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

DB = "mongodb://localhost:27017/instagramTask";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 4500;
const server = app.listen(port, () => {
  console.log(
    `App is running in "${process.env.NODE_ENV}" environment on port "${port}"`
  );
});
