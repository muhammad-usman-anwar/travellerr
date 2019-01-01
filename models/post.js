const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
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
  Time: {
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
  description: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  }
});

module.exports = mongoose.model("Post", postSchema);
