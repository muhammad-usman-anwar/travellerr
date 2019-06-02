const Car = require('../models/car')

exports.is_allowed = (req, res, next) => {
    Car.find({
            userId: req.userId
        })
        .countDocuments()
        .then(num => {
            if (num > 0) next();
            else {
                const error = new Error("No car registered");
                error.statusCode = 400;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 400;
            next(err)
        })
}