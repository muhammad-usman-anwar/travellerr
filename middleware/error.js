const {
    validationResult
} = require("express-validator/check")

exports.validationErrors = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        next()
    } catch (error) {
        next(error)
    }
}