const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  startTime: {
    type: String,
    required: false
  },
  arrivalTime: {
    type: String,
    required: false
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  initiator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true
  },
  state: {
    type: String,
    required: true
  },
  origin: {
    latitude: {
      type: String,
      required: false
    },
    longitude: {
      type: String,
      required: false
    }
  },
  time: {
    type: String,
    required: false
  },
  destination: {
    latitude: {
      type: String,
      required: false
    },
    longitude: {
      type: String,
      required: false
    }
  },
});

module.exports = mongoose.model("Trip", tripSchema);