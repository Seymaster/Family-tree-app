"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const spouseSchema = mongoose.Schema({
    wives: {type: String, require: true}
}) 

const offSpringSchema = mongoose.Schema({
    firstName: {type: String, require: true},
    middleName: {type: String, require: true},
    lastName: {type: String, require: true},
    placeOfBirth: {type: String, require: true},
    occupation: {type: String, require: true}
})

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    image: {type: String, require: true},
    surName: {type: String, require: true},
    firstName: {type: String, require: true},
    otherName: {type: String, require: false},
    sex: {type: String, require: true},
    dateOfBirth: {type: String, require: true},
    maritalStatus: {type: String, require: true},
    phoneNumber: {type: Number, require: true},
    fatherName: {type: String, require: true},
    motherName: {type: String, require: true},
    spouse: [spouseSchema],
    offSpring: [offSpringSchema],
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
const UserProfile =  mongoose.model("UserProfile", Schema)



module.exports = UserProfile;