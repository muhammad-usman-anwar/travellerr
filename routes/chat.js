const express = require("express");
const {
  body
} = require("express-validator/check");

//Models
const User = require("../models/user");
const Chat = require("../models/chat");

//Controllers
const chatController = require("../controllers/chat");

//Middlewares
const is_auth = require("../middleware/is_auth");
const {
  validationErrors
} = require('../middleware/error')

const router = express.Router();

router.put(
  "/add",
  is_auth,
  [
    body("userId")
    .trim()
    .not()
    .isEmpty()
    .custom((value, {
      req
    }) => {
      return User.findOne({
        _id: value
      }).then(userDoc => {
        if (!userDoc) Promise.reject("Invalid User Id");
      });
    })
  ],
  validationErrors,
  chatController.add
);

router.put(
  "/insert",
  is_auth,
  [
    body("chatId").custom((value, {
      req
    }) => {
      return Chat.findOne({
        _id: value
      }).then(chatDoc => {
        if (!chatDoc) {
          Promise.reject("invalid chat id");
        }
      });
    }),
    body("message")
    .trim()
    .not()
    .isEmpty()
  ],
  validationErrors,
  chatController.insert
);

router.get("/", is_auth, chatController.list);

router.get("/:id", is_auth, chatController.read);

module.exports = router;