const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    picture: String
    }, {
        timestapms: true
    }
);

module.exports = mongoose.model('User', UserSchema);