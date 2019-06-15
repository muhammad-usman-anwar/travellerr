//Models
const Trip = require("../models/trip");
const Post = require('../models/post')

exports.create = async (req, res, next) => {
    try {
        const postDoc = await Post.findById(req.body.postId)
        if (!postDoc) throw new Error('Internal server error')
        const users = [req.userId];
        users.concat(req.body.poolers)
        new Trip({
                initiator: req.userId,
                users: users,
                carId: req.body.carId,
                postId: postDoc._id
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

exports.finish = (req, res, next) => {};

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