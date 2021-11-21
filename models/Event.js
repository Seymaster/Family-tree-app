"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema = mongoose.Schema({
    userId: {type: String, require: true},
    title: {type: String, require: true},
    eventType: {type: String, require: true},
    eventLocation: {type: String, require: true},
    start: {type: String, require: true, unique: true},
    end: {type: String, require: true},
    eventDesc: {type: String, require: true},
    eventImage: {type: String, require: true},
    dateCreated: {type: Date, default: Date.now}
},
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v
            delete ret._id
        }
    }
}
)
Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Event =  mongoose.model("Event", Schema)

module.exports = Event;