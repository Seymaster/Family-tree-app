"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const parentSchema = mongoose.Schema({
    father: {type: String, required: false, default: null},
    mother: {type: String, required: false, default: null}
})

const spouseSchema = mongoose.Schema({
    wives: {type: String, required: false, default: null}
})

const Schema    = mongoose.Schema({
    userId: {type: String, required: false,default: null},
    familyId: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
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