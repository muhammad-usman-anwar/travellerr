const { validationResult } = require("express-validator/check");

const IO = require("../socket");

const Chat = require("../models/chat");
const User = require("../models/user");

exports.list = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const chatList = [];
    const chatDocs = await Chat.find({
      users: req.userId
    });
    for (let index = 0; index < chatDocs.length; index++) {
      const doc = chatDocs[index];
      for (let i = 0; i < doc.users.length; i++) {
        const user = doc.users[i];
        if (user != req.userId) {
          const userDoc = await User.findById(user);
          chatList.push({
            id: doc._id,
            user: {
              id: userDoc._id,
              name: `${userDoc.firstName} ${userDoc.lastName}`
            }
          });
        }
      }
    }
    res.status(200).json({ list: chatList });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.read = (req, res, next) => {
  const io = IO.getIO();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  Chat.findOne({ _id: req.params.id })
    .then(chatDoc => {
      if (!chatDoc) res.status(401).json({ message: "Invalid chat id" });
      else {
        IO.setRoomEvent(chatDoc._id);
        res.status(200).json({ chat: chatDoc });
      }
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.insert = (req, res, next) => {
  const io = IO.getIO();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  Chat.findOne({ _id: req.body.chatId })
    .then(chatDoc => {
      if (!chatDoc) res.status(401).json({ message: "Invalid chat id" });
      else {
        chatDoc.messages.push({
          userId: req.userId,
          message: req.body.message
        });
        chatDoc.save();
        io.to(req.body.chatId).emit("chat-notify", {
          data: "message recieved"
        });
        res.status(200).json({ error: false });
      }
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.add = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  Chat.findOne({ users: req.body.userId })
    .countDocuments()
    .then(num => {
      if (num) {
        const error = new Error("Chat Allready exists");
        error.statusCode = 400;
        error.data = errors.array();
        throw error;
      } else {
        return new Chat({
          users: [req.userId, req.body.userId],
          messages: [
            {
              userId: req.userId,
              message: req.body.message
            }
          ]
        }).save();
      }
    })
    .then(result => {
      res.status(201).json({
        message: "New chat created",
        chat_id: result._id
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error("Internal error");
      error.statusCode = 401;
      throw error;
    });
};
