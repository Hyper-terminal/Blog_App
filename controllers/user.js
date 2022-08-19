const User = require("../models/user");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
    // find user based on id
    User.findById(id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        else {
            // adding new property called profile to req object
            req.profile = user;
            next();
        }
    })
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) {
        res.status(403).json({
            error: "User is not authorized to perform this action"
        })
    }
}

exports.allUsers = (req, res) => {
    User.find((e, user) => {
        if (e) res.status(400).json({ error: e });
        else {
            res.json(user);
        }
    }).select("name email updated created");
}

exports.getUser = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body);

    user.updated = Date.now();

    user.save((err) => {
        if (err) {
            res.status(400).json({ error: "You are not authorized to perform this action" })
        }

        user.password = undefined;
        res.json(user)
    })
}

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        else {
            res.json({ message: "User deleted successfully" });
        }
    })
}
