const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Created_at: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

module.exports = mongoose.model("User", userSchema);