const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    device: { type: String, required: true },
    no_of_comments: { type: Number, required: true },
    creator: { type: String, required: true },
    name: { type: String, required: true },
})

const Post = mongoose.model("post", postSchema);

module.exports = Post