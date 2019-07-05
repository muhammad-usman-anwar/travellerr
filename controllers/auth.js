const User = require("../models/user");
const IO = require("../socket");
const EmailService = require("../emailService");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, response, next) => {
  response.status(200).json({
    error: false,
    message: "data recieved"
  });
  IO.getIO().once("connection", socket => {
    const code = Math.round(Math.random() * 1000000);
    EmailService.sendVerificationMail(req.body.email, code);
    socket.on("verify", data => {
      console.log('Code:' + code + '\tRecieved code' + data.code);

      if (!data.code) {
        socket.disconnect(true);
        const error = new Error("Socket Failed");
        error.statusCode = 422;
        error.data = errors.array();
        console.error(error);
      } else if (data.code != code) {
        socket.disconnect(true);
        const error = new Error("Invalid code");
        error.statusCode = 422;
        error.data = errors.array();
        socket.emit("message", {
          error: true,
          message: error
        });
      }
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const cnic = req.body.cnic;
      const dateOfBirth = req.body.dateOfBirth;
      const gender = req.body.gender;
      const phone = req.body.phoneNo;
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
            gender: gender,
            phoneNo: phone
          });
          return user.save();
        })
        .then(result => {
          socket.emit("message", {
            error: false,
            message: "user created"
          });
        })
        .catch(err => {
          socket.emit("message", {
            error: true,
            message: err.message
          });
        });
    });
  });
};

exports.signin = (req, res, next) => {
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
      const token = jwt.sign({
          userId: loadedUser._id
        },
        "Allah is the greatest", {
          expiresIn: "1h"
        }
      );
      console.log(`Logged in : ${loadedUser.firstName}`);
      res.status(200).json({
        token: token,
        id: loadedUser._id,
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

exports.details = (req, res, next) => {
  User.findOne({
      _id: req.userId
    })
    .then(details => {
      if (!details) {
        const error = new Error("Error");
        error.statusCode = 401;
        throw error;
      } else {
        res.status(200).json({
          data: details
        });
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};