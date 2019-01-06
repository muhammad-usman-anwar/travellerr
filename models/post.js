const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  origin: {
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
  },
  time: {
    type: String,
    required: true
  },
  destination: {
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
  interested: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);
