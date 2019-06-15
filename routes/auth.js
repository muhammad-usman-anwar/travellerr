const express = require("express");
const {
  body
} = require("express-validator/check");

//Models
const User = require("../models/user");

//Controllers
const authController = require("../controllers/auth");

//Middlewares
const is_auth = require("../middleware/is_auth");
const {
  validationErrors
} = require('../middleware/error')

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom((value, {
      req
    }) => {
      return User.findOne({
        email: value
      }).then(userDoc => {
        if (userDoc) {
          Promise.reject("email address allready exists!");
        }
      });
    })
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({
      min: 6
    }),
    body("firstName")
    .trim()
    .not()
    .isEmpty(),
    body("lastName")
    .trim()
    .not()
    .isEmpty(),
    body("cnic")
    .not()
    .isEmpty(),
    body("dateOfBirth")
    .trim()
    .not()
    .isEmpty(),
    body("gender")
    .trim()
    .not()
    .isEmpty()
  ],
  validationErrors,
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({
      min: 6
    })
  ],
  validationErrors,
  authController.signin
);

router.get("/", is_auth, authController.details);

module.exports = router;