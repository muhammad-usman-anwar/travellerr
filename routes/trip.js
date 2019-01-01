const express = require("express");
const { body } = require("express-validator/check");

const Car = require("../models/car");
const TripController = require("../controllers/trip");
const is_auth = require("../middleware/is_auth");

const router = express.Router();

router.put("/add", is_auth, TripController.create);

router.post("/start", is_auth, TripController.start);

router.post("/finish", is_auth, TripController.finish);

module.exports = router;
