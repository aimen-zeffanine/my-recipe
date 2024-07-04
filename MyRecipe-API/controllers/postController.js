const Post = require('../models/post');
const mongoose = require('mongoose');
const fileWriter = require('../fileWriter');
const moment = require('moment');
moment.locale('ar_SA');

exports.create = (req, res) => {
    var post = new Post({
        title: req.body.title,
        components: req.body.components,
        steps: req.body.steps,
        userId: req.body.userId
    });
    var picturePath = fileWriter.write(req.body.picture, post._id);
    post.picture = picturePath;
    post.save({new: true}).then((post) => {
        res.status(201).json(post);
    }).catch(error => {
        res.status(500).send(error);
    })
}

exports.getAll = (req, res) => {
    var postsArr = [];
    var userId = req.query.userId;
    Post.find()
    .then(posts => {
        posts.forEach(element => {
            var post = {
                id: element._id,
                title: element.title,
                components: element.components,
                steps: element.steps,
                likes: element.likes,
                userId: element.userId,
                picture: element.picture,
                isCreatedByCurrentUser: element.userId == userId,
                isLikedByCurrentUser: element.likes.find(l => l == userId)? true: false,
                date: moment(element.createdAt).fromNow(),
            }
            postsArr.push(post);
        });
        res.status(200).json(postsArr);
    })
}

exports.getPost = (req, res) => {}

exports.update = (req, res) => {}

exports.like = (req, res) => {
    var postId = req.body.postId;
    var userId = req.body.userId;
    Post.findOne({_id: postId})
    .then(post => {
        var userLike = post.likes.find(l => l == userId);
        if (!userLike) {
            post.likes.push(userId);
            post.save({new: true});
            res.status(201).send(post.likes);
        } else {
            var index = post.likes.findIndex(l => l == userLike);
            post.likes.splice(index);
            post.save({new: true});
            res.status(201).send(post.likes);
        }
    }).catch(error => {
        res.status(500).send(error);
    })
}