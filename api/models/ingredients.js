const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    }, 
    base:{
        type:Boolean,
        required:true,
    }, 
    
    

});

module.exports = mongoose.model('Ingredients',ingredientsSchema);