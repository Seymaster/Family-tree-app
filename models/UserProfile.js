"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const spouseSchema = mongoose.Schema({
    wives: {type: String, require: false, default: null},
    email: {type: String, require: false, default: null}
}) 

const offSpringSchema = mongoose.Schema({
    firstName: {type: String, require: false, default: null},
    middleName: {type: String, require: false, default: null},
    lastName: {type: String, require: false, default: null},
    placeOfBirth: {type: String, require: false, default: null},
    occupation: {type: String, require: false, default: null},
    email: {type: String, require: false, default: null}
})

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    familyId: {type: String, require: false, default: null},
    image: {type: String, require: true},
    surName: {type: String, require: true},
    firstName: {type: String, require: true},
    otherName: {type: String, require: false, default: null},
    sex: {type: String, require: true},
    dateOfBirth: {type: String, require: true},
    maritalStatus: {type: String, require: true},
    phoneNumber: {type: Number, require: true},
    fatherName: {type: String, require: true},
    fatherEmail: {type: String, require: true},
    motherName: {type: String, require: true},
    motherEmail: {type: String, require: true},
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