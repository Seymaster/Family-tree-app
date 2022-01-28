"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");



const spouseSchema = mongoose.Schema({
    wives: {type: String, required: false, default: null},
    email: {type: String, required: false, default: null}
}) 

const offSpringSchema = mongoose.Schema({
    firstName: {type: String, required: false, default: null},
    middleName: {type: String, required: false, default: null},
    lastName: {type: String, required: false, default: null},
    placeOfBirth: {type: String, required: false, default: null},
    occupation: {type: String, required: false, default: null},
    email: {type: String, required: false, default: null}
})

const userSchema    = mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    image: {type: String, required: true},
    surName: {type: String, required: true},
    firstName: {type: String, required: true},
    otherName: {type: String, required: false, default: null},
    sex: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    maritalStatus: {type: String, required: true},
    email: {type: String, required: true},
    fatherName: {type: String, required: true},
    fatherEmail: {type: String, required: true},
    motherName: {type: String, required: true},
    motherEmail: {type: String, required: true},
    spouse: [spouseSchema],
    offSpring: [offSpringSchema],
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
}
);

// Schema.index({"$**":"text"});
// Schema.plugin(mongoosePaginate);
const UserProfile =  mongoose.model("UserProfile", userSchema)


module.exports = UserProfile;