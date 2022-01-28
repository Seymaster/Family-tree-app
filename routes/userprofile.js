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


router.post("/userprofile", userProfileController.createUserProfile)
// , validate(schemas.userProfileSchema.userProfilePost, 'body')

router.get("/userprofile", userProfileController.getUserProfileById)

router.put("/updatespouse/:profileId", userProfileController.addWives)

router.put("/updateoffspring/:profileId", userProfileController.addOffSpring)

router.get("/familytree/:userId", userProfileController.getFamilyTree)

// router.get("/getparent/:userId", userProfileController.getUserParent)

// router.get("/getspouse/:userId/:partnerId", userProfileController.getUserSpouse)

// router.get("/getoffspring/:userId", userProfileController.getUserOffSpring)

// router.get("/allfamilies/:familyId", userProfileController.getBirthday)

// router.get("/familytree/:id", userProfileController.familytree)





module.exports = router;