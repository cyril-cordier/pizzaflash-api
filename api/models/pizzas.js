const mongoose = require('mongoose');

const pizzasSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },
    base:{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients', required: true },
    ingredients:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients', required: true }],
    price:{
        type:String,
        required:false,
    },
    special:{
        type:Boolean,
        required:false,
    },
    status:{
        type:String,
        required:true,
    },

});

module.exports = mongoose.model('Pizzas',pizzasSchema);