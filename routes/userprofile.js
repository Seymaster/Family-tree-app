const express = require("express");
const router  = express.Router();
const userProfileController = require("../controllers/userprofile")


router.post("/userprofile", userProfileController.createUserProfile)

router.get("/userprofile/:profileId", userProfileController.getUserProfileById)

router.put("/updatewives/:profileId", userProfileController.addWives)

router.put("/updateoffspring/:profileId", userProfileController.addOffSpring)





module.exports = router;