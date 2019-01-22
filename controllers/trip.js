const {
    validationResult
} = require("express-validator/check");

const Trip = require("../models/trip");
const Post = require('../models/post')

exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const postDoc = await Post.findById(req.body.postId)
        if (!postDoc) throw new Error('Internal server error')
        new Trip({
                users: [req.userId],
                carId: req.body.carId,
                postId: postDoc._id,
                chatId: req.body.chatId
            })
            .save()
            .then(result => {
                res.status(201).json({
                    error: false,
                    message: 'trip created'
                }).catch(err => {
                    console.log(err);
                    const error = new Error('Internal server error')
                    error.statusCode = 401
                    throw error
                })
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
};

exports.start = (req, res, next) => {};

exports.finish = (req, rees, next) => {};

exports.getTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
        if (!trip) throw new Error('Invalid Trip ID')
        res.status(200).json({
            error: false,
            trip: trip
        })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}