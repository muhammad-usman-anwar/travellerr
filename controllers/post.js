const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

exports.read = (req, res, next) => {};

exports.add = (res, req, next) => {
  new Post({
    userId: req.userId,
    origin: {
      latitude: req.body.origin.latitude,
      longitude: req.body.origin.longitude
    },
    time: new Date().getTime(),
    destination: {
      latitude: req.body.destination.latitude,
      longitude: req.body.destination.longitude
    },
    description: req.body.description || null,
    interestedUsers: req.body.userId
  })
    .save()
    .then(result => {
      res.status(201).json({
        message: "Post Added",
        error: "false"
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error("Internal error");
      error.statusCode = 401;
      throw error;
    });
};

exports.edit = (res, req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  Post.findOneAndUpdate(
    { _id: req.body.postId },
    {
      origin: {
        latitude: req.body.origin.latitude,
        longitude: req.body.origin.longitude
      },
      time: req.body.time,
      destination: {
        latitude: req.body.destination.latitude,
        longitude: req.body.destination.longitude
      },
      description: req.body.description || null,
      chatId: req.body.chatId || null
    }
  )
    .then(result => {
      res.status(200).json({
        message: "Post Updated",
        error: "false"
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error("Internal error");
      error.statusCode = 401;
      throw error;
    });
};
