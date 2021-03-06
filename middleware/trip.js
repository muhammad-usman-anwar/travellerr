const Car = require('../models/car')
const Trip = require('../models/trip')
const OngoingTrip = require('../models/ongoingTrip')

exports.is_allowed_to_create = (req, res, next) => {
    Car.find({
            userId: req.userId
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next();
            else {
                const error = new Error("No car registered");
                error.statusCode = 400;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}

exports.is_allowed_to_manupulate = (req, res, next) => {
    Trip.find({
            _id: req.params.id,
            users: req.userId
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next();
            else {
                const error = new Error("No car registered");
                error.statusCode = 400;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}

exports.is_initiator = (req, res, next) => {
    Trip.find({
            _id: req.params.id,
            initiator: req.userId
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next();
            else {
                const error = new Error("No car registered");
                error.statusCode = 400;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}

exports.is_rating_allowed = (req, res, next) => {
    Trip.find({
            _id: req.params.id,
            users: req.param.user
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next()
            else {
                const error = new Error("No trip exist with this id and user");
                error.statusCode = 400;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}

exports.is_allowed_to_start = (req, res, next) => {
    Trip.find({
            initiator: req.userId,
            state: 'ONGOING'
        })
        .countDocuments()
        .then(num => {
            if (num > 0) throw new Error('You already have an ongoing trip');
            next();
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}

exports.is_requested = (req, res, next) => {
    OngoingTrip.find({
            requested: req.userId
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next();
            else throw new Error('You are not requested to join trip');
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}