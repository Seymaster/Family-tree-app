"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema    = mongoose.Schema({
    primaryUserId: {type: String, required: true},
    secondaryUserId:   {type: String, required: true, unique: true},
    type:   {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updateAt: {type: Date}

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
const UserRelationship =  mongoose.model("UserRelationship", Schema)



module.exports = UserRelationship;