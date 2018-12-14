const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            Promise.reject("email address allready exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 }),
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
  authController.signup
);

router.post("/login", authController.signin);

module.exports = router;
