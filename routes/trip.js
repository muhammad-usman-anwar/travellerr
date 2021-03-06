const express = require("express");
const {
    body,
    param
} = require("express-validator/check");

//Models
const Car = require("../models/car");
const Post = require('../models/post')
const Trip = require('../models/trip')
const User = require('../models/user')

//Controllers
const TripController = require("../controllers/trip");

// Middlewares
const is_auth = require("../middleware/is_auth");
const {
    is_allowed_to_create,
    is_initiator,
    is_allowed_to_start,
    is_allowed_to_manupulate,
    is_rating_allowed,
    is_requested
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


router.post("/:id/start",
    is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
        body('latitude').not().isEmpty(),
        body('longitude').not().isEmpty()
    ],
    validationErrors,
    is_initiator,
    is_allowed_to_start,
    TripController.start);

router.post("/:id/finish",
    is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
        body('latitude').not().isEmpty(),
        body('longitude').not().isEmpty(),
        body('users').not().isEmpty().isArray(),
        body('distance').not().isEmpty(),
    ],
    validationErrors,
    is_initiator,
    TripController.finish);

router.post("/:id/finishRide",
    is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
        body('latitude').not().isEmpty(),
        body('longitude').not().isEmpty(),
        body('users').not().isEmpty().isArray(),
        body('distance').not().isEmpty(),
    ],
    validationErrors,
    is_initiator,
    TripController.finishRide);

router.get('/:id', is_auth, [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        })
    ],
    validationErrors,
    TripController.getTrip
)

router.get('/:id/accept', is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        })
    ],
    validationErrors,
    is_requested,
    TripController.accept
)

router.get('/:id/reject', is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
    ],
    validationErrors,
    is_requested,
    TripController.reject
)

router.get('/:id/cancel', is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
    ],
    validationErrors,
    is_allowed_to_manupulate,
    TripController.cancel
)

router.post('/:id/rate/:user', is_auth,
    [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
        param('user').custom((value, req) => {
            return User.findById(value).then(userDoc => {
                if (!userDoc) Promise.reject('Invalid user Id')
            })
        }),
        body('rating').not().isEmpty()
    ],
    validationErrors,
    is_allowed_to_manupulate,
    is_rating_allowed,
    TripController.rate
)

router.post('/:id/update', is_auth, [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        }),
        body('latitude').not().isEmpty(),
        body('longitude').not().isEmpty(),
    ],
    validationErrors,
    is_initiator,
    TripController.updateOngoingTrip
)

router.get('/:id/update', is_auth, [
        param('id').custom((value, req) => {
            return Trip.findById(value).then(trip => {
                if (!trip) Promise.reject('Invalid Trip Id')
            })
        })
    ],
    validationErrors,
    is_allowed_to_manupulate,
    TripController.getUpdateOngoingTrip
)

router.get('/requested-trip', is_auth, is_allowed_to_manupulate, TripController.getRequested);

module.exports = router;