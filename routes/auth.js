const express = require("express");
const { signup, signin, signout } = require("../controllers/user");
const { userSinupValidator } = require("../validator/index");

const router = express.Router();

router.route("/signup").post(userSinupValidator, signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);

module.exports = router;
