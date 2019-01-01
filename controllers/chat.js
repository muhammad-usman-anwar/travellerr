const { validationResult } = require("express-validator/check");

const Chat = require("../models/chat");

exports.list = (req, res, next) => {
<<<<<<< HEAD
    Chat.find({
        users: req.userId 
    }).then(chatDocs => {
        if(!chatDocs) res.status(401).json({ message: 'No chats of the user'})
        else{
            let chats = [];
            chatDocs.forEach(chatDoc => {
                chats.push({
                    id: chatDoc._id,
                    users: chatDoc.users
                })
            })
            res.status(200).json({list: chats})
        }
    }).catch(err => {
        if(!err.statusCode) err.statusCode = 500
        next(err)
=======
  Chat.find({
    users: {
      userId: req.userId
    }
  })
    .then(chatDocs => {
      if (!chatDocs) res.status(401).json({ message: "No chats of the user" });
      else {
        let chats = [];
        carDocs.forEach(carDoc => {
          chats.push({
            id: carDoc._id,
            users: carDoc.users
          });
        });
        res.status(200).json(chats);
      }
>>>>>>> child
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.read = (req, res, next) => {
<<<<<<< HEAD
    Chat.findOne({ _id: req.params.id})
    .then(chatDoc => {
        if(!chatDoc) res.status(401).json({message: 'Invalid chat id'})
        else res.status(200).json({chat: chatDoc.messages})
=======
  Chat.findOne({ _id: req.param.id })
    .then(chatDoc => {
      if (!chatDoc) res.status(401).json({ message: "Invalid chat id" });
      else res.status(200).json(chatDoc);
>>>>>>> child
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.insert = (req, res, next) => {
<<<<<<< HEAD
    Chat.findOne({ _id: req.body.chatId})
    .then(chatDoc => {
        if(!chatDoc) res.status(401).json({message: 'Invalid chat id'})
        else {
            chatDoc.messages.push({
                userId: req.userId,
                message: req.body.message
            })
            chatDoc.save()
            res.status(200).json({error: false})
        }
=======
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  Chat.findOne({ _id: req.param.id })
    .then(chatDoc => {
      if (!chatDoc) res.status(401).json({ message: "Invalid chat id" });
      else {
        chatDoc.messages.push({
          userId: req.userId,
          message: req.body.message
        });
        chatDoc.save();
      }
>>>>>>> child
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
  const chat = new Chat({
    users: [req.userId, req.body.userId],
    messages: [
      {
        userId: req.userId,
        message: req.body.message
      }
    ]
  })
    .save()
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
