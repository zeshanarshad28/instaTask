const express = require("express");
const userController = require("../controllers/usersControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

router.post("/getPost", authController.protect, userController.getPost);

module.exports = router;
