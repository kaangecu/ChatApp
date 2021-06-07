const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({

    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    created:{
        type:Date,
        default:Date.now
    }
});

module.exports = User = mongoose.model("User",UserScheme);