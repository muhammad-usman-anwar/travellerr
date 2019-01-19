const {
  validationResult
} = require("express-validator/check");

const Post = require("../models/post");
const User = require("../models/user");
const IO = require("../socket");

exports.read = async (req, res, next) => {
  try {
    let users = [];
    let user;
    const resData = [];
    const postDocs = await Post.find();
    for (let index = 0; index < postDocs.length; index++) {
      const doc = postDocs[index];
      for (let i = 0; i < doc.interested.length; i++) {
        const id = doc.interested[i];
        const userDoc = await User.findById(id);
        users.push({
          id: userDoc._id,
          name: `${userDoc.firstName} ${userDoc.lastName}`
        });

        if (doc.userId.toString() == userDoc._id.toString()) {
          user = {
            id: userDoc._id,
            name: `${userDoc.firstName} ${userDoc.lastName}`
          };
        }
      }
      resData.push({
        id: doc._id,
        user: user,
        time: doc.time,
        origin: doc.origin,
        destination: doc.destination,
        description: doc.description,
        interested: users
      });
      users = [];
    }

    res.status(200).json({
      data: resData
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.add = (req, res, next) => {
  console.log("Testing:\t" + req.body);

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
        latitude: req.body.origin_latitude,
        longitude: req.body.origin_longitude
      },
      time: req.body.time,
      destination: {
        latitude: req.body.destination_latitude,
        longitude: req.body.destination_longitude
      },
      description: req.body.description || null,
      interested: [req.userId]
    })
    .save()
    .then(result => {
      const io = IO.getIO();
      io.emit("posts-updated");
      res.status(201).json({
        message: "Post Added",
        error: false
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
  Post.findOneAndUpdate({
      _id: req.body.postId
    }, {
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
    })
    .then(result => {
      const io = IO.getIO();
      io.emit("posts-updated");
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
    const io = IO.getIO();
    io.emit("posts-updated", {
      message: "updated posts"
    });
    res.status(201).json({
      error: false,
      message: "added"
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};