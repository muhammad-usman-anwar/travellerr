const Car = require('../models/car')


exports.add = (req, res, next) => {
    console.log(req.userId)
    new Car({
        model: req.body.model,
        manufacturer: req.body.manufacturer,
        license: req.body.license,
        userId: req.userId
    }).save().then(result => {
        res.status(201).send({
            message: 'Car Added',
            error: "false"
        })
    }).catch(err => {
        console.log(err)
        const error = new Error('Internal error')
        error.statusCode = 401
        throw error
    })
}

exports.remove = (req, res, next) => {
    Car.findOneAndDelete({
            license: req.body.license,
            userId: req.userId
        })
        .then(result => {
            console.log(result)
            res.status(200).send({
                message: 'Car removed'
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.update = (req, res, next) => {
    Car.findOne({
            license: req.body.license,
            userId: req.userId
        })
        .then(carDoc => {
            carDoc.model = req.body.model
            carDoc.manufacturer = req.body.manufacturer
            carDoc.update()
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.read = (req, res, next) => {
    Car.find({
        userId: req.userId
    }).then(carDoc => {
        if (!carDoc) {
            res.status(401).send({
                message: "No car registered"
            })
        }
        res.status(200).send(JSON.stringify(carDoc))
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}