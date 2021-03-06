"use strict";

const UserProfile = require("./UserProfile");
const Repository = require("./MongodbRespository");

class UserProfileRepository extends Repository{
    constructor(){
        super(UserProfile)
    }

    nonMetaFields(){
        return ["image","surName","firstName","otherName","sex","dateOfBirth","maritalStatus","email"]
    }
}

module.exports = (new UserProfileRepository());