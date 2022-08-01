const express = require("express");
const { getPosts, createPost } = require("../controllers/post");
const { createPostValidator } = require("../validator/index");

const router = express.Router();

router.route("/",).get(getPosts);
router.route("/post").post(createPostValidator, createPost);

module.exports = router;