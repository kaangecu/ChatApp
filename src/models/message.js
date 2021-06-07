const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageScheme = new Schema({
    content:{
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    receiverType: {
        type:String,
        enum: ["PUBLIC", "PRIVATE"],
        required: true
    },
    created:{
        type:Date,
        default:Date.now
    }
});

module.exports = Message = mongoose.model("Message",MessageScheme);