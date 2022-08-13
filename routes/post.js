const express = require("express");
const { getPosts, createPost, postById, deletePost, isPoster, postsByUser, updatePost } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator/index");

const router = express.Router();

router.route("/",).get(getPosts);
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.put("/post/:postId", requireSignin, isPoster, updatePost);

router.get("/posts/by/:userId", postsByUser);
router.delete("post/:postId", requireSignin, isPoster, deletePost);

// any route containing user id our app will first execute userById method
router.param("userId", userById);
router.param("postId", postById);

module.exports = router;
