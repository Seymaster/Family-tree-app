"use strict";

const Tree = require("./Tree");
const Repository = require("./MongodbRespository");

class TreeRepository extends Repository{
    constructor(){
        super(Tree)
    }

    nonMetaFields(){
        return ["userId","name","email","gender","parent","spouse","children"]
    }
}



module.exports = (new TreeRepository());