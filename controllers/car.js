const {
  validationResult
} = require("express-validator/check");

const Car = require("../models/car");

exports.add = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  new Car({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      license: req.body.license,
      userId: req.userId
    })
    .save()
    .then(result => {
      res.status(201).json({
        message: "Car Added",
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

exports.remove = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  Car.findOneAndDelete({
      license: req.body.license,
      userId: req.userId
    })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Car removed"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  const car = new Car({
    userId: req.userId,
    model: req.body.model,
    manufacturer: req.body.manufacturer,
    license: req.body.license
  });
  Car.updateOne({
        license: req.body.license,
        userId: req.userId
      },
      car
    )
    .then(result => {
      res.status(200).json({
        error: false,
        message: "updated"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.read = (req, res, next) => {
  Car.find({
      userId: req.userId
    })
    .then(carDoc => {
      if (!carDoc) {
        res.status(401).json({
          message: "No car registered"
        });
      }
      res.status(200).json({
        error: "flase",
        data: carDoc
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};