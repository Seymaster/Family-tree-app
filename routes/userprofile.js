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

// Create User Profile
router.post("/userprofile", userProfileController.createUserProfile)
// , validate(schemas.userProfileSchema.userProfilePost, 'body')

// Create Relationship 
router.post("/relationship", userProfileController.createUserRelationship)

// Get User Profile by UserId, ProfileId and other key value
router.get("/userprofile", userProfileController.getUserProfileById)

// Get relationship by Type, primaryUserId etc
router.get("/relationship", userProfileController.getRelationshipByType)

// Get Parent with UserId
router.get("/getparent/:userId", userProfileController.getUserParent)

// Get Spouse with userId
router.get("/getspouse/:userId", userProfileController.getUserSpouse)

// Get Children with userId
router.get("/getchildren/:userId", userProfileController.getUserChildren)

// Get Sibling with userId
router.get("/getsibling/:userId", userProfileController.getUserSibling)

// router.get("/allfamilies/:familyId", userProfileController.getBirthday)

// router.get("/familytree/:id", userProfileController.familytree)





module.exports = router;