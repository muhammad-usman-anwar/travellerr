const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cnic: {
        type: Number,
        unique: true,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    rating: [{
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        }
    }]
})

module.exports = mongoose.model('User', userSchema)