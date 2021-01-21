const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const pizzaRoutes = require('./api/routes/pizzas');
const reviewRoutes = require('./api/routes/reviews');
const ingredientRoutes = require('./api/routes/ingredients');


//connect db 
mongoose.connect(process.env.MONGO_ATLAS_DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    
});
mongoose.Promise = global.Promise

app.use(morgan('dev')); // Message de requete dans la console 

// extraire le body 
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());


// cors 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

// Routes 

app.use('/users' ,userRoutes);
app.use('/pizzas',pizzaRoutes);
app.use('/reviews',reviewRoutes);
app.use('/ingredients',ingredientRoutes);


app.use((req,res,next) =>{
    const error = new Error('404 Not Found');
    error.status = 400;
    next(error); 
});

// Gestion message d'erreur

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;