const EventEmitter = require("events");

let io;
const ioEvents = new EventEmitter();

module.exports = {
  init: httpServer => {
    io = require("socket.io")(httpServer);
    io.on("connection", socket => {
      ioEvents.on("addToRoom", room => {
        socket.join(room);
      });
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io is not initialized");
    }
    return io;
  },
  setRoomEvent: room => {
    ioEvents.emit("addToRoom", room);
  }
};
