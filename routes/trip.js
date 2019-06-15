const express = require("express");
const {
    body
} = require("express-validator/check");

//Models
const Car = require("../models/car");
const Post = require('../models/post')

//Controllers
const TripController = require("../controllers/trip");

// Middlewares
const is_auth = require("../middleware/is_auth");
const {
    is_allowed_to_create
} = require('../middleware/trip');
const {
    validationErrors
} = require('../middleware/error')

const router = express.Router();

router.put("/add",
    is_auth,
    [
        body('postId').custom((value, {
            req
        }) => {
            return Post.findById(value).then(post => {
                if (!post) Promise.reject('Invalid Post Id')
            })
        }),
        body('carId').custom((value, {
            req
        }) => {
            return Car.findOne({
                _id: value,
                userId: req.userId
            }).then(carDoc => {
                if (!carDoc) Promise.reject('Invalid car Id')
            })
        }),
        body('poolers').not().isEmpty().isArray()
    ],
    validationErrors,
    is_allowed_to_create,
    TripController.create
);

router.get("/add/get/cars", is_auth, is_allowed_to_create, TripController.getCars);

router.get("/add/get/posts", is_auth, is_allowed_to_create, TripController.getPosts);

router.post("/add/get/interested",
    is_auth,
    [
        body('postId').custom((value, {
            req
        }) => {
            return Post.findById(value).then(post => {
                if (!post) Promise.reject('Invalid Post Id')
            })
        })
    ],
    validationErrors,
    is_allowed_to_create,
    TripController.getInterested
);


router.post("/start", is_auth, TripController.start);

router.post("/finish", is_auth, TripController.finish);

router.get('/:id', is_auth, TripController.getTrip)

module.exports = router;