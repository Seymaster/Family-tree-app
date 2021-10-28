const express = require("express");
const router  = express.Router();
const eventController = require("../controllers/events")


router.post("/event", eventController.createEvent)

router.get("/event/:eventId", eventController.getEventById)

router.get("/events", eventController.getEvent)

module.exports = router;