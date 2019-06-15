const express = require("express");
const {
  body,
  param
} = require("express-validator/check");

//Models
const Post = require("../models/chat");

//Controllers
const postController = require("../controllers/post");

//Middlewares
const is_auth = require("../middleware/is_auth");
const {
  validationErrors
} = require('../middleware/error')

const router = express.Router();

router.get("/", is_auth, postController.read);

router.patch(
  "/",
  is_auth,
  [
    body("postId").custom((value, {
      req
    }) => {
      return Post.findOne({
        _id: value
      }).then(postDoc => {
        if (!carDoc) {
          Promise.reject("invalid post id");
        }
      });
    })
  ],
  validationErrors,
  postController.edit
);

router.put(
  "/new",
  is_auth,
  [
    body("origin_latitude")
    .trim()
    .not()
    .isEmpty(),
    body("origin_longitude")
    .trim()
    .not()
    .isEmpty(),
    body("time")
    .trim()
    .not()
    .isEmpty(),
    body("destination_latitude")
    .not()
    .isEmpty(),
    body("destination_longitude")
    .not()
    .isEmpty()
  ],
  validationErrors,
  postController.add
);

router.get("/:id/interested", is_auth, [param('id').not().isEmpty()], validationErrors, postController.interested);

module.exports = router;