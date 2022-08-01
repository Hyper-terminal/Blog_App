const Post = require("../models/post");

exports.getPosts = (req, res) => {
    // getting all posts from db
    const posts = Post.find()
        .then((post) => res.json({ posts }))
        .catch(err => console.log(err));
}

exports.createPost = async (req, res) => {
    // creating new post
    const post = await new Post(req.body);

    // saving post to db
    await post.save()
        .then(result => res.json({ post: result }));

}