const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

exports.read = (req, res, next) => {};

exports.add = (res, req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
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
    interested: req.body.userId
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
      next(error);
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
      next(error);
    });
};

exports.interested = async (req, res, next) => {
  try {
    const postDoc = await Post.findById(req.params.id);
    const interested = postDoc.interested;
    for (let index = 0; index < interested.length; index++) {
      const element = interested[index];
      if (element == req.userId) throw new Error("Allready set");
    }
    interested.push(req.userId);
    postDoc.interested = interested;
    postDoc.save();
    res.status(201).json({ error: false, message: "added" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
