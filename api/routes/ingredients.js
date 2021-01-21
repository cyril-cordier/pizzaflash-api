const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth.js')

const Ingredient = require('../models/ingredients');



router.get('/',(req,res,next) => {
   Ingredient.find()
   .select('-__v')
   .exec()
   .then(data => {
       const response = {
           count: data.length,
           Ingredient: data 
       }
       if(data){
           res.status(200).json(response);
       }else{
           res.status(404).json({message: 'No entries !'});
       }  
   })
   .catch(err=> res.status(500).json({error: err}));

});


router.get('/:ingredientId',(req,res,next) => {
    const id = req.params.ingredientId; 
    Ingredient.findById(id)
   .exec()
   .then(data => {
       console.log(data);

       if(data){
           res.status(200).json({
               message:'Ingredient retrivied successfully',
               Ingredient:data,
               request:{
                   type:'GET',
                   url:'http://localhost:3000/ingredients',
               }
           })
       }else{
           res.status(400).json({message: 'No valid Ingredient entry found for provided ID'});
       }
   })
   .catch(err=>res.status(500).json({error:err}));


})



router.delete('/:ingredientId', checkAuth,(req,res,next) =>{
    const id = req.params.ingredientId; 
    Ingredient.remove({_id: id})
    .exec()
    .then(data => {
        console.log(data)
        if(data){
            res.status(200).json({
                success: 'Ingredient deleted successfully',
               request:{
                    type:'POST',
                    url: 'http://localhost:3000/ingredients',
                  //  body: { title: 'String', ingredient: 'String'}
  
                } 
            })
        }else{
            res.status(400).json({message: 'No valid Ingredient entry found for provided ID'});
        }
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.patch('/:ingredientId', checkAuth,(req,res,next) =>{
    const id = req.params.ingredientId; 
   const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    
    } 

    

    Ingredient.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            success: 'Ingredient updated successfully',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/ingredients/' + id

            } 
        
    });
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.post('/', checkAuth,(req,res,next) => {
    const ingredient = new Ingredient({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        base:req.body.base
    });

    ingredient.save()
        .then(result => {
            console.log(result);

        res.status(200).json({
            success: "Ingredient created successfully ",
            createdIngredient : Ingredient,
            request:{
                type:'GET',
                url:'http://localhost:3000/ingredients/' + result._id
            }
        })
        })
        .catch(err=>res.status(500).json({error:err}));


})





module.exports = router;


