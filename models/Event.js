"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    eventType: {type: String, required: true},
    eventLocation: {type: String, required: true},
    start: {type: String, required: true, unique: true},
    end: {type: String, required: true},
    eventDesc: {type: String, required: true},
    eventImage: {type: String, required: true},
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