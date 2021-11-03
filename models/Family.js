"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const parentSchema = mongoose.Schema({
    father: {type: String, require: false, default: null},
    mother: {type: String, require: false, default: null}
})

const spouseSchema = mongoose.Schema({
    wives: {type: String, require: false, default: null}
})

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    parent: [parentSchema],
    partner: [spouseSchema],
    dateCreated: {type: Date, default: Date.now}
}, 
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v;
            delete ret._id;
        }
    }
}
);
Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Family =  mongoose.model("Family", Schema)



module.exports = Family;