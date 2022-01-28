"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema    = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    gender: {type: String, required: true},
    parentFather: {type: String, required: false,default: null},
    parentMother: {type: String, required: false,default: null},
    spouse: {type: String, required: false,default: null},
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
const Family =  mongoose.model("Family", Schema)



module.exports = Family;