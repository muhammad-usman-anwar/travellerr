const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  arrivalTime: {
    type: String,
    required: false
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
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
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  }
});

module.exports = mongoose.model("Trip", tripSchema);