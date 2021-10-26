"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const spouseSchema = mongoose.Schema({
    wives: {type: String, required: true}
}) 

const offSpringSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    middleName: {type: String, required: true},
    lastName: {type: String, required: true},
    placeOfBirth: {type: String, required: true},
    occupation: {type: String, required: true}
})

const Schema    = mongoose.Schema({
    image: {type: String, required: true},
    surName: {type: String, required: true},
    firstName: {type: String, required: true},
    otherName: {type: String, required: false},
    sex: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    maritalStatus: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    fatherName: {type: String, required: true},
    motherName: {type: String, required: true},
    spouse: [spouseSchema],
    offSpring: [offSpringSchema]

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