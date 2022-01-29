const express = require("express");
const router  = express.Router();
const WebhookController = require("../Services/webhook")


// GET /all events
router.post("/getnewuser", WebhookController.getNewUser);


module.exports = router;