const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    components: String,
    steps: [String],
    likes: [mongoose.Types.ObjectId],
    userId: mongoose.Types.ObjectId,
    picture: String
    },{
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);