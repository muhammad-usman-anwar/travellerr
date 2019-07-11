const IO = require("../socket");

//Models
const User = require('../models/user')
const Trip = require('../models/trip')
const Post = require('../models/post')
const Car = require('../models/car')
const OngoingTrip = require('../models/ongoingTrip')

const TripState = require('../tripState')

//fare calculation function
function calFare(noOfUsers, distance, rate) {
    return (distance * rate) / noOfUsers;
}

exports.create = async (req, res, next) => {
    try {
        const io = IO.getIO();
        const postDoc = await Post.findById(req.body.postId)
        if (!postDoc) throw new Error('Internal server error')
        new Trip({
                initiator: req.userId,
                users: [req.userId],
                carId: req.body.carId,
                postId: postDoc._id,
                state: 'INITIATED'
            })
            .save()
            .then(result => {
                new OngoingTrip({
                        tripId: result._id,
                        requested: req.body.poolers,
                        state: 'INITIATED'
                    }).save()
                    .then(doc => {
                        if (!doc) throw new Error('INternal System Error');
                        res.status(201).json({
                            error: false,
                            message: 'trip created'
                        })
                        io.emit("trip-requested", {
                            tripId: doc._id
                        });
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
                const fare = [];
                for (let index = 0; index < result.users.length; index++) {
                    if (result.users[index] === req.userId) continue;
                    fare.push({
                        userId: result.users[index],
                        fare: 0
                    })
                }
                OngoingTrip.findOneAndUpdate({
                    tripId: req.params.id
                }, {
                    position: {
                        latitude: req.body.latitude,
                        longitude: req.body.longitude
                    },
                    state: 'ONGONG',
                    fare: fare,
                }).then(doc => {
                    if (!doc) throw new Error('INternal Server Error');
                    IO.setRoomEvent(req.params.id)
                    res.status(200).json({
                        error: false,
                        message: 'trip started'
                    })

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

function findFareUser(fareArray, userId) {
    for (let index; index < fareArray; index++) {
        if (fareArray[index].userId === userId) return index;
    }
    return null;
}

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
                OngoingTrip.findOne({
                        tripId: req.params.id
                    })
                    .then(doc => {
                        if (!doc) throw new Error('Internal Server Error')
                        const fare = [];
                        let j = 0;
                        for (let i = 0; i < doc.fare.length; i++) {
                            let index = -1;
                            if (j < req.body.users.length) {
                                index = findFareUser(doc.fare[i], req.body.users[j]);
                            }
                            doc.fare[i].fare += calFare(doc.fare.length + 1, req.body.distance, 10.0);
                            if (index !== -1) fare.push(doc.fare[index]);
                            index = -1;
                        }
                        doc.state = 'COMPLETED';
                        doc.position.latitude = req.body.latitude;
                        doc.position.longitude = req.body.longitude;
                        doc.save()
                            .then(resDoc => {
                                if (!resDoc) throw new Error('Internal Serer Error')
                                res.status(200).json({
                                    error: false,
                                    message: 'trip completed',
                                    data: fare
                                })
                            })
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

exports.finishRide = (req, res, next) => {
    OngoingTrip.findOne({
            tripId: req.params.id
        })
        .then(doc => {
            if (!doc) throw new Error('Internal Server Error')
            const fare = [];
            for (let i = 0; i < doc.fare.length; i++) {
                let index = -1;
                if (j < req.body.users.length) {
                    index = findFareUser(doc.fare[i], req.body.users[j]);
                }
                doc.fare[i].fare += calFare(doc.fare.length + 1, req.body.distance, 10.0);
                if (index !== -1) fare.push(doc.fare[index]);
                index = -1;
            }
            doc.position.latitude = req.body.latitude;
            doc.position.longitude = req.body.longitude;
            doc.save()
                .then(resDoc => {
                    if (!resDoc) throw new Error('Internal Serer Error')
                    res.status(200).json({
                        error: false,
                        message: 'Ride completed',
                        data: fare
                    })
                })
        }).catch(error => {
            if (!error.statusCode) error.statusCode = 500
            next(error)
        })
}


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
    Trip.findById(req.params.id)
        .then(doc => {
            doc.users.push(req.userId);
            doc.save()
                .then(result => {
                    if (!result) throw new Error('Internal System Error');
                    res.status(200).json({
                        error: false,
                        message: "Accepted"
                    })
                    io.to(req.params.id).emit("offer-accepted");
                })
        })
        .catch(error => {
            if (!error.statusCode) error.statusCode = 500
            next(error)
        })
}

exports.reject = (req, res, next) => {
    try {
        OngoingTrip.findOne({
                tripId: req.params.id
            })
            .then(tripDoc => {
                tripDoc.requested.forEach((value, index, array) => {
                    if (value === req.userId) {
                        tripDoc.requested.splice(index, 1);
                        tripDoc.save()
                            .then(result => {
                                if (!result) throw new Error('Internal server Error!')
                                res.status(200).json({
                                    error: false,
                                    message: 'Offer Rejected'
                                })
                                io.to(req.params.id).emit("offer-rejected");
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
                if (!result) throw new Error("Internal Server Error")
                OngoingTrip.findOneAndDelete(req.params.id)
                    .then(flag => {
                        if (!flag) throw new Error("Internal Server Error")
                        res.status(200).json({
                            error: false,
                            message: 'Trip canceled'
                        })
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