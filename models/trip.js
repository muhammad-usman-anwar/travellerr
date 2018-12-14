const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema({
    Origin: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    Destination: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    distanceTravelled: {
        type: Number,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    users: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    carId: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    }
})

module.exports = mongoose.model('Trip', tripSchema)