'use strict'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
|
*/
const express = require("express");
const router  = express.Router();
const eventController = require("../controllers/events")
const schemas = require("../middleware/schemas");
const { validate } = require("../middleware/helper");


router.post("/event", validate(schemas.eventSchema.eventPost, 'body'),  eventController.createEvent)

router.get("/event/:eventId", eventController.getEventById)

router.get("/events", eventController.getEvent)

module.exports = router;