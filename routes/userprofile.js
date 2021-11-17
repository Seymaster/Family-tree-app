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
const userProfileController = require("../controllers/userprofile")
const schemas = require("../middleware/schemas");
const { validate } = require("../middleware/helper");


router.post("/userprofile", validate(schemas.userProfileSchema.userProfilePost, 'body'), userProfileController.createUserProfile)

router.get("/userprofile/:profileId", userProfileController.getUserProfileById)

router.put("/updatespouse/:profileId", userProfileController.addWives)

router.put("/updateoffspring/:profileId", userProfileController.addOffSpring)

router.get("/getparent/:userId", userProfileController.getUserParent)

router.get("/getspouse/:userId/:partnerId", userProfileController.getUserSpouse)

router.get("/getoffspring/:userId", userProfileController.getUserOffSpring)

router.get("/allfamilies/:familyId", userProfileController.getBirthday)

// router.get("/familytree/:userId", userProfileController.getfamilytree)





module.exports = router;