const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });

    // check if user already exists
    if (userExists) {
        res.status(403).json({
            error: "Email is taken"
        })
    }
    else {
        // if user doesn't exists create newone
        const user = new User(req.body);

        // save hashed password
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (!err) {
                user.password = hash;
                user.save();

            } else {
                console.log(err);
            }
        });

        res.status(200).json({ message: "Signup success! Please login." });
    }
}

exports.signin = async (req, res) => {
    // find user based on the email
    User.findOne({ email: req.body.email }, (err, user) => {
        // if err or no user
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email doesn't exist. Please signin."
            })
        }
        // if user is found make sure password and email match
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (err || !result) {
                return res.status(401).json({
                    error: "Email and password do not match"
                })
            } else {
                // generate token based on user id and secret
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

                // persist above created token in a cookie
                res.cookie("t", token, { expire: new Date() + 9999 });

                // return response with user and token to fronend client(this is optional as we have already sent token with a cookie)

                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } })
            }
        });
    });
}


exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Singout successfully." });
}