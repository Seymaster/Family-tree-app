"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");


const Schema    = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    gender: {type: String, required: true},
    parent: [{type: Object, required: false,default: null}],
    spouse: [{type: Object, required: false,default: null}],
    children: [{type: Object, required: false,default: null}],
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
const Tree =  mongoose.model("Tree", Schema)