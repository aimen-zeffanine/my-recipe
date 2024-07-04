const User = require('../models/user');
const mongoose = require('mongoose');
const fileWriter = require('../fileWriter');

exports.create = (req, res) => {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    user.save().then(user => {
        res.status(201).json(user);
    }).catch(error => {
        res.status(500).send();
    });
}

exports.validateEmail = (req, res) => {
    // Implementation
    User.findOne({email: req.query.email})
    .then(user => {
        if(!user) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

exports.validateUsername = (req, res) => {
    User.findOne({username: req.query.username})
    .then(user => {
        if(!user) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

exports.getUser = (req, res) => {
    var userId = req.query.userId;
    User.findOne({_id: userId})
    .then(user => {
        res.status(200).json(user);
    }).catch(error => {
        res.status(500).send(error);
    })
}

exports.login = (req, res) => {
    console.log(req.body);
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send();
        }
    }).catch(error => {
        res.status(500).send(error);
    })
}

exports.updateImage = (req, res) => {
    User.findOne({_id: req.body.userId})
    .then( user => {
        var picture = fileWriter.write(req.body.picture, user._id);
        user.picture = picture;
        user.save({new: true});
        res.status(202).json(user);
    }).catch(error => {
        res.status(500).send(error);
    })
}

exports.update = (req, res) => {}