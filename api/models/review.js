const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    comment:{
        type:String,
        required:true,
    },
    mark:{
        type:String,
        required:true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: false },
    created_at: {type: String, required: true},
});


module.exports = mongoose.model('review',reviewsSchema);