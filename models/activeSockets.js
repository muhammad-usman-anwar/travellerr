const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activeSockets = new Schema({
  room: {
    type: String,
    required: true
  },
  sockets: [
    {
      type: String,
      required: true
    }
  ]
});

module.exports = mongoose.model("Log", activeSockets);
