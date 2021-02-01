const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth.js')

const User = require('../models/user');


router.post('/register',(req,res,next) =>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                error:{
                  badEmail:'Email already exists'
                } 
            })
        }else{

            bcrypt.hash(req.body.password,10, (err,hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    });
        
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password: hash
                        });
        
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            success: 'User created successfully',
                            email:user.email
                        })
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    })
                    
                }
        
            });
        

        }
    })
    
})

router.post('/login',(req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({error:'Please check Email or Password'});
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result) =>{
            if(err){
                return res.status(401).json({error:'Please check Email or Password'});
            }
            if(result){
               const pizzatoken =  jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id, 
                    is_admin:user[0].is_admin
                },process.env.JWT_KEY,
                {
                    expiresIn:"4500h"
                })
                return res.status(200).json({
                    success: 'Auth successfull',
                    pizzatoken: pizzatoken
                })

            }
         res.status(401).json({error:'Please check Email or Password'});
        });
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});
router.patch('/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
  
    function updateUser(){
      User.updateOne({_id: id}, { $set: updateOps })
      .exec()
      .then(result => {                                                                                       // update user ! 
        console.log(result);
        res.status(200).json({
          success: 'User updated successfully',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/api/users/' + id
          }
        });
      })
      .catch(err => res.status(500).json({error: err}));
    }
  
  
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
      if(updateOps['password']){
  
      
        bcrypt.hash(updateOps['password'], 10, (err, hash) => {
          if (err) { // hash
            return res.status(500).json({ error: err });
          } else {
            updateOps['password'] = hash;
            updateUser(); 
          }
        })
      }else{
        updateUser();
      }
    
  })
  
  
  router.get('/me', checkAuth,(req,res,next) => { 
     const pizzatoken = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(pizzatoken, process.env.JWT_KEY); 
      User.findById(decoded.userId)
      .select('-password')
      .exec()
      .then(data => {
        const response = {
          count: data.length,
          profile: data
        }
        if (data) {
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No entries !'
          });
        }
      })
      .catch(err => res.status(500).json({
        error: err
      }));
  
      
    })
  
  router.get('/', checkAuth,(req, res, next) => {
    User.find()
      .select('-__v')
      .exec()
      .then(data => {
        const response = {
          count: data.length,
          users: data
        }
        if (data) {
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No entries !'
          });
        }
      })
      .catch(err => res.status(500).json({
        error: err
      }));
  
  });
  
  
  router.delete('/:userId', checkAuth,(req,res,next) =>{
    const id = req.params.userId; 
    User.remove({_id: id})
    .exec()
    .then(data => {
        console.log(data)
        if(data){
            res.status(200).json({
                success: 'Users deleted successfully',
            /*    request:{
                    type:'POST',
                    url: 'http://localhost:3000/api/users',
                    body: { title: 'String', genre: 'String'}
  
                }  */
            })
        }else{
            res.status(400).json({message: 'No valid User entry found for provided ID'});
        }
    })
    .catch(err=>res.status(500).json({error:err}));
  })

  router.get('/:userId', checkAuth,(req,res,next) =>{
    const id = req.params.userId; 
    User.find({_id: id})
    .select('-__v ')
    .exec()
    .then(data => {
        console.log(data)
        if(data){
            res.status(200).json({
                message: 'Users retrievied successfully',
                user : data
            /*    request:{
                    type:'POST',
                    url: 'http://localhost:3000/api/users',
                    body: { title: 'String', genre: 'String'}
  
                }  */
            })
        }else{
            res.status(400).json({message: 'No valid User entry found for provided ID'});
        }
    })
    .catch(err=>res.status(500).json({error:err}));
  })
  
  
  module.exports = router;