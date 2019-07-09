const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ongoingTripSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    position: {
        latitude: {
            type: String,
            required: false
        },
        longitude: {
            type: String,
            required: false
        }
    },
    state: {
        type: String,
        required: true,
    },
    requested: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    fare: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        fare: {
            type: Number,
            required: false
        }
    }]
})

module.exports = mongoose.model("OngoingTrip", ongoingTripSchema);