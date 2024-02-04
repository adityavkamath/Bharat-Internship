const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

// Optional: Create a virtual field for a custom post ID
postSchema.virtual('customPostId').get(function() {
    return this._id.toString();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
