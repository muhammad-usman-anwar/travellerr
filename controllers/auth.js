const User = require("../models/user");
const IO = require("../socket");
const EmailService = require("../emailService");

const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  res.status(200).json({ error: false, message: "data recieved" });
  IO.getIO().on("connection", socket => {
    const code = Math.round(Math.random() * 1000000);
    EmailService.sendVerificationMail(req.body.email, code);
    socket.on("verify", data => {
      if (!data.code) {
        socket.disconnect(true);
        const error = new Error("Socket Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      } else if (data.code != code) {
        socket.disconnect(true);
        const error = new Error("Invalid code");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const cnic = req.body.cnic;
      const dateOfBirth = req.body.dateOfBirth;
      const gender = req.body.gender;
      bcrypt
        .hash(password, 15)
        .then(hashedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            cnic: cnic,
            dateOfBirth: dateOfBirth,
            gender: gender
          });
          return user.save();
        })
        .then(result => {
          socket.emit("message", { error: false, message: "user created" });
        })
        .catch(err => {
          socket.emit("message", { error: ture, message: err.message });
        });
    });
  });
};

exports.signin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        const error = new Error("User with this email could not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Invalid password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: loadedUser._id
        },
        "Allah is the greatest",
        {
          expiresIn: "1h"
        }
      );
      console.log(`Logged in : ${loadedUser.firstName}`);
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
