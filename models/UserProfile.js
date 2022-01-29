"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema    = mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    image: {type: String, required: false},
    surName: {type: String, required: false},
    firstName: {type: String, required: true},
    otherName: {type: String, required: false, default: null},
    sex: {type: String, required: false},
    dateOfBirth: {type: String, required: false},
    maritalStatus: {type: String, required: false},
    email: {type: String, required: true},
    createdAt: {type: Date, default: Date.now} 
}, 
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v;
            delete ret._id;
        }
    }
});


Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const UserProfile =  mongoose.model("UserProfile", Schema)


module.exports = UserProfile;