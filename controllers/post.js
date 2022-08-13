const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getPosts = (req, res) => {
  // getting all posts from db
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => res.json({
      posts
    }))
    .catch(err => console.log(err));
}

exports.updatePost = (req, res, next) => {
    let post = req.profile;
    post = _.extend(post, req.body);

    post.updated = Date.now();

    post.save((err) => {
        if (err) {
            res.status(400).json({ error: "You are not authorized to perform this action" })
        }

        res.json(post)
    })
}

exports.createPost = (req, res) => {

  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let post = new Post(fields);

    req.profile.password = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          err
        });
      }
      res.json(result);
    })
  })
}

exports.postsByUser = (req, res) => {
  Post.find({
    postedBy: req.profile._id
  })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          err
        });
      } else {
        res.json(result);
      }
    })
}

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(400).json({
          err
        });
      } else {
        req.post = result;
        next();
      }
    })
}

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id === req.auth._id;
  if(!isPoster){
    return res.status(403).json({error: "User is not authorized"});
  }

  next();
}

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, deletedpost) => {
    if(err){
      return res.status(400).json({err});
    }else{
      res.json({message: "Deleted successfully"});
    }
  })
}
