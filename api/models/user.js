const mongoose = require('mongoose');

// schema pour mongodb

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        required: true,
        unique: true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },

    password:{
        type:String,
        required:true
    },
    
    is_admin:{
        type:Boolean,
        required:false,
        default:false
    }
    

});

module.exports = mongoose.model('User',userSchema);