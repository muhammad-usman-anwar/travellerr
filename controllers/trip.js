const IO = require("../socket");

//Models
const User = require('../models/user')
const Trip = require('../models/trip')
const Post = require('../models/post')
const Car = require('../models/car')

const TripState = require('../tripState')

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
                postId: postDoc._id,
                state: 'INITIATED'
            })
            .save()
            .then(result => {
                res.status(201).json({
                    error: false,
                    message: 'trip created'
                })
            })
            .catch(err => {
                console.log(err);
                const error = new Error('Internal server error')
                error.statusCode = 401
                throw error
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
};

exports.start = (req, res, next) => {
    try {
        Trip.findByIdAndUpdate(req.params.id, {
                origin: {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                },
                startTime: (new Date).toISOString(),
                state: 'ONGOING'
            })
            .then(result => {
                TripState.add({
                    id: req.params.id,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                })
                IO.setRoomEvent(req.params.id)
                res.status(200).json({
                    error: false,
                    message: 'trip started'
                })
            })
            .catch(err => {
                throw err
            })

    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
};

exports.finish = (req, res, next) => {
    try {
        Trip.findByIdAndUpdate(req.params.id, {
                destination: {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                },
                arrivalTime: (new Date).toISOString(),
                state: 'COMPLETED'
            })
            .then(result => {
                res.status(200).json({
                    error: false,
                    message: 'trip completed'
                })
            })
            .catch(err => {
                throw err
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
};

exports.getTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
        if (!trip) throw new Error('Invalid Trip ID')
        IO.setRoomEvent(req.params.id)
        res.status(200).json({
            error: false,
            trip: trip
        })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.getCars = (req, res, next) => {
    try {
        Car.find({
                userId: req.userId
            })
            .then(documents => {
                if (!documents) {
                    const error = new Error("Error");
                    error.statusCode = 401;
                    throw error;
                }
                const result = [];
                for (let i = 0; i < documents.length; i++) {
                    result.push({
                        id: documents[i]._id,
                        details: `${documents[i].manufacturer} ${documents[i].model} ${documents[i].license}`
                    })
                }
                res.status(200).json({
                    data: result
                });
            })
            .catch(err => {
                throw err
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.getInterested = (req, res, next) => {
    try {
        Post.findById(req.body.postId)
            .then(async document => {
                if (!document) {
                    const error = new Error("Invalid Post Id");
                    error.statusCode = 401;
                    throw error;
                }
                const interested = document.interested
                const interestedList = []
                for (let i = 0; i < interested.length; i++) {
                    const user = await User.findById(interested[i])
                    interestedList.push({
                        id: user._id,
                        details: `${user.firstName} ${user.lastName}`
                    })
                }
                res.status(200).json({
                    data: interestedList
                });
            })
            .catch(err => {
                throw err
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.getPosts = (req, res, next) => {
    try {
        Post.find({
                interested: req.userId
            })
            .then(documents => {
                if (!documents) {
                    const error = new Error("Error");
                    error.statusCode = 401;
                    throw error;
                }
                const result = [];
                for (let i = 0; i < documents.length; i++) {
                    result.push({
                        id: documents[i]._id,
                        origin: documents[i].origin,
                        destination: documents[i].destination,
                    })
                }
                res.status(200).json({
                    data: result
                });
            })
            .catch(err => {
                throw err
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.accept = (req, res, next) => {
    res.status(200).json({
        message: "Accepted"
    })
}

exports.reject = (req, res, next) => {
    try {
        Trip.findById(req.params.id)
            .then(tripDoc => {
                tripDoc.users.forEach((value, index, array) => {
                    if (value === req.userId) {
                        tripDoc.users.splice(index, 1);
                        tripDoc.save()
                            .then(result => {
                                if (!result) throw new Error('Internal server Error!')
                                res.status(200).json({
                                    error: false,
                                    message: 'Offer Rejected'
                                })
                            })
                            .catch(err => {
                                throw err
                            })
                        return;
                    }
                })
            })
            .catch(err => {
                throw err
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.cancel = (req, res, next) => {
    try {
        Trip.findByIdAndDelete(req.params.id)
            .then(result => {
                if (!result) {
                    throw new Error("Internal Server Error")
                }
                res.status(200).json({
                    error: false,
                    message: 'Trip canceled'
                })
            })
            .catch(err => {
                throw err
            })

    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.rate = (req, res, next) => {
    try {
        User.findById(req.params.user)
            .then(userDoc => {
                userDoc.rating.push({
                    value: req.body.rating,
                    tripId: req.params.id
                })
                userDoc
                    .save()
                    .then(result => {
                        res.status(200).json({
                            error: false,
                            message: "Ratings updated"
                        })
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                throw err;
            })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.updateOngoingTrip = (req, res, next) => {
    try {
        const io = IO.getIO()
        TripState.setData({
            id: req.params.id,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        })
        io.to(req.params.id).emit('trip-notify', {
            message: 'Cordinates updated'
        })
        res.status(200).json({
            error: false,
            message: 'UPDATED'
        })

    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}

exports.getUpdateOngoingTrip = (req, res, next) => {
    try {
        const data = TripState.getData(req.params.id)
        res.status(200).json({
            error: false,
            data: {
                latitude: data.latitude,
                longitude: data.longitude
            }
        })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        next(error)
    }
}