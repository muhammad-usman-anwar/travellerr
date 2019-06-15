const express = require('express')
const {
    body
} = require('express-validator/check')

//Models
const Car = require('../models/car')

//Controllers
const carController = require('../controllers/car')

//Middlewares
const is_auth = require('../middleware/is_auth')
const {
    validationErrors
} = require('../middleware/error')

const router = express.Router()

router.put('/add', is_auth, [
    body('license').custom((value, {
        req
    }) => {
        return Car.findOne({
            license: value
        }).then(carDoc => {
            if (carDoc) {
                Promise.reject('Car with license number allready registered')
            }
        })
    }),
    body('model').trim().not().isEmpty(),
    body('manufacturer').trim().not().isEmpty(),
], validationErrors, carController.add)

router.post('/remove', is_auth, [
    body('license').trim().not().isEmpty()
], validationErrors, carController.remove)

router.patch('/update', is_auth, [
    body('license').custom((value, {
        req
    }) => {
        return Car.findOne({
            license: value
        }).then(carDoc => {
            if (!carDoc) {
                Promise.reject('Car with license number doesn\'t registered')
            }
        })
    }),
    body('model').trim().not().isEmpty(),
    body('manufacturer').trim().not().isEmpty(),
    body('license').not().isEmpty(),
], validationErrors, carController.update)

router.get('/', is_auth, carController.read)

module.exports = router