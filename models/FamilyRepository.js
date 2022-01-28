"use strict";

const Family = require("./Family");
const Repository = require("./MongodbRespository");

class FamilyRepository extends Repository{
    constructor(){
        super(Family)
    }

    nonMetaFields(){
        return ["userId","name","email","gender","parentFather","parentMother","spouse"]
    }
}



module.exports = (new FamilyRepository());