const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth.js')

const Review = require('../models/review');



router.get('/', checkAuth,(req,res,next) => {
   Review.find()
   .populate('user','-password')
   .populate('pizza')
   .select('-__v')
   .exec()
   .then(data => {
       const response = {
           count: data.length,
           Review: data 
       }
       if(data){
           res.status(200).json(response);
       }else{
           res.status(404).json({message: 'No entries !'});
       }  
   })
   .catch(err=> res.status(500).json({error: err}));

});


router.get('/:reviewId', checkAuth,(req,res,next) => {
    const id = req.params.reviewId; 
    Review.findById(id)
    .populate('user','-password')
    .populate('pizza')
    .exec()
    .then(data => {
       console.log(data);

       if(data){
           res.status(200).json({
               message:'Review retrivied successfully',
               Review:data,
               request:{
                   type:'GET',
                   url:'http://localhost:3000/reviews',
               }
           })
       }else{
           res.status(400).json({message: 'No valid Review entry found for provided ID'});
       }
   })
   .catch(err=>res.status(500).json({error:err}));


})



router.delete('/:reviewId', checkAuth,(req,res,next) =>{
    const id = req.params.reviewId; 
    Review.remove({_id: id})
    .exec()
    .then(data => {
        console.log(data)
        if(data){
            res.status(200).json({
                success: 'Review deleted successfully',
               request:{
                    type:'POST',
                    url: 'http://localhost:3000/reviews',
                  //  body: { title: 'String', genre: 'String'}
  
                } 
            })
        }else{
            res.status(400).json({message: 'No valid Review entry found for provided ID'});
        }
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.patch('/:reviewId', checkAuth,(req,res,next) =>{
    const id = req.params.reviewId; 
   const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    
    } 

    

    Review.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            success: 'Review updated successfully',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/reviews/' + id

            } 
        
    });
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.post('/', checkAuth,(req,res,next) => {
    var created = new Date().toLocaleDateString('fr-FR', {year: 'numeric', month: 'numeric', day: 'numeric' }).split('/')
    
    
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        comment:req.body.comment,
        mark:req.body.mark,
        user:req.body.user,
        pizza:req.body.pizza,
        created_at:created[1]+"/"+created[0]+"/"+created[2]

    });

    review.save()
        .then(result => {
            console.log(result);

        res.status(200).json({
            success: "Review created successfully ",
            createdReview : Review,
            request:{
                type:'GET',
                url:'http://localhost:3000/reviews/' + result._id
            }
        })
        })
        .catch(err=>res.status(500).json({error:err}));


})





module.exports = router;


