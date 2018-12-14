const express = require('express')
const {
    body
} = require('express-validator/check')

const Trip = require('../models/car')
//const TripController = require('../controllers/trip')
const is_auth = require('../middleware/is_auth')

const router = express.Router()


module.exports = router