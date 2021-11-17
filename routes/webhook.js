const express = require("express");
const router  = express.Router();
const WebhookController = require("../controllers/webhook")


// GET /all events
router.post("/getnewuser", WebhookController.getNewUser);


module.exports = router;