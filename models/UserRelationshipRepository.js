"use strict";

const UserRelationship = require("./UserRelationship");
const Repository = require("./MongodbRespository");

class UserRelationshipRepository extends Repository{
    constructor(){
        super(UserRelationship)
    }

    nonMetaFields(){
        return ["primaryUserId","secondaryUserId","type"]
    }
}



module.exports = (new UserRelationshipRepository());