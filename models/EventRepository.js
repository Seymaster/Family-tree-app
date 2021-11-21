"use strict";

const Event = require("./Event");
const Repository = require("./MongodbRespository");

class EventRepository extends Repository{
    constructor(){
        super(Event)
    }

    nonMetaFields(){
        return ["eventName","eventType","eventLocation","start","end","eventDescription","eventImage"]
    }
}

module.exports = (new EventRepository());