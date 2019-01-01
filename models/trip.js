const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  Origin: {
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
  },
  startTime: {
    type: String,
    required: true
  },
  Destination: {
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
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
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  }
});

module.exports = mongoose.model("Trip", tripSchema);
