const express = require("express");
const router  = express.Router();
const userProfileController = require("../controllers/userprofile")


router.post("/userprofile", userProfileController.createUserProfile)

router.get("/userprofile/:profileId", userProfileController.getUserProfileById)

router.put("/updatespouse/:profileId", userProfileController.addWives)

router.put("/updateoffspring/:profileId", userProfileController.addOffSpring)

router.get("/getparent/:userId", userProfileController.getUserParent)

router.get("/getspouse/:userId/:partnerId", userProfileController.getUserSpouse)

router.get("/getoffspring/:userId", userProfileController.getUserOffSpring)





module.exports = router;