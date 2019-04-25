const express = require("express");
const {
    body
} = require("express-validator/check");

const Car = require("../models/car");
const Post = require('../models/post')
const Chat = require('../models/chat')
const TripController = require("../controllers/trip");
const is_auth = require("../middleware/is_auth");

const router = express.Router();

router.put("/add", is_auth, [
    body('postId').custom((value, {
        req
    }) => {
        return Post.findById(value).then(post => {
            if (!post) Promise.reject('Invalid Post Id')
        })
    }),
    body('carId').custom((value, {
        req
    }) => {
        return Car.findOne({
            _id: value,
            userId: req.userId
        }).then(carDoc => {
            if (!carDoc) Promise.reject('Invalid car Id')
        })
    }),
    body('chatId').custom((value, {
        req
    }) => {
        return Chat.findById(value).then(chatDoc => {
            if (!chatDoc) Promise.reject('Invalid chatId')
        })
    })
], TripController.create);

router.post("/start", is_auth, TripController.start);

router.post("/finish", is_auth, TripController.finish);

router.get('/:id', is_auth, TripController.getTrip)

module.exports = router;