const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSinupValidator } = require("../validator/index");

const router = express.Router();

router.route("/signup").post(userSinupValidator, signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);

// any route containing user id our app will first execute userById method
router.param("userId", userById);

module.exports = router;
