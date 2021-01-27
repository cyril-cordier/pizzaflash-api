const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth.js')

const Pizza = require('../models/pizzas');



router.get('/', (req,res,next) => {
   Pizza.find()
   .select('-__v')
   .exec()
   .then(data => {
       const response = {
           count: data.length,
           Pizza: data 
       }
       if(data){
           res.status(200).json(response);
       }else{
           res.status(404).json({message: 'No entries !'});
       }  
   })
   .catch(err=> res.status(500).json({error: err}));

});


router.get('/:pizzaId', (req,res,next) => {
    const id = req.params.pizzaId; 
    Pizza.findById(id)
   .exec()
   .then(data => {
       console.log(data);

       if(data){
           res.status(200).json({
               message:'Pizza retrivied successfully',
               Pizza:data,
               request:{
                   type:'GET',
                   url:'http://localhost:3000/pizzas',
               }
           })
       }else{
           res.status(400).json({message: 'No valid Pizza entry found for provided ID'});
       }
   })
   .catch(err=>res.status(500).json({error:err}));


})



router.delete('/:pizzaId', checkAuth,(req,res,next) =>{
    const id = req.params.pizzaId; 
    Pizza.remove({_id: id})
    .exec()
    .then(data => {
        console.log(data)
        if(data){
            res.status(200).json({
                success: 'Pizza deleted successfully',
               request:{
                    type:'POST',
                    url: 'http://localhost:3000/pizzas',
                  //  body: { title: 'String', genre: 'String'}
  
                } 
            })
        }else{
            res.status(400).json({message: 'No valid Pizza entry found for provided ID'});
        }
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.patch('/:pizzaId', checkAuth,(req,res,next) =>{
    const id = req.params.pizzaId; 
   const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    
    } 

    

    Pizza.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            success: 'Pizza updated successfully',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/pizzas/' + id

            } 
        
    });
    })
    .catch(err=>res.status(500).json({error:err}));
})

router.post('/', checkAuth,(req,res,next) => {
    const pizza = new Pizza({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        base:req.body.base,
        ingredients:req.body.ingredients,
        price:req.body.price,
        special:req.body.special,
        status:req.body.status

    });

    pizza.save()
        .then(result => {
            console.log(result);

        res.status(200).json({
            success: "Pizza created successfully ",
            createdPizza : pizza,
            request:{
                type:'GET',
                url:'http://localhost:3000/pizzas/' + result._id
            }
        })
        })
        .catch(err=>res.status(500).json({error:err}));


})





module.exports = router;


