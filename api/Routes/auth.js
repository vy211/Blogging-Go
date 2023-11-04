const express = require('express')
const app=express();
const router = express.Router()
const cors=require('cors');
app.use(express.json());
const User=require('../Models/User.js');

//For reading cookies
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
//when passing credentials we need set up additional properties
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());



//login 
router.post('/login',async (req, res) => {
    
    const {username,password}=req.body;//Retrieving the username and password from request body

  try{
    console.log(username,password);
    const userDoc=await User.findOne({username});//finding the username in database

    
    //If password macthes then we are good to go
    if(password===userDoc.password){
      
      const payload={username,id:userDoc._id};

      jwt.sign(payload,process.env.JWT_SECRET,{},(err,token)=>{
        if(err){
          throw err;
        }
        else{
            console.log('token generated ',userDoc._id);
            res.cookie('token',token).json({
            id:userDoc._id,
            username,
          });
        }
      });
    }
    else{
      //if password was not matched
      res.status(400).json('wrong credentials');
    }
  }catch (error) {
    res.json({"msg":error});
  }
});

//logout
router.post('/logout',(req,res)=>{
  res.cookie('token','').json('ok');
});


// define the register page route

router.post('/register',async (req, res) => {
    const {username,password}=req.body;

    //First look for ,whether same username already exists in db or not if it does ,ask user to change username
    const user=await User.findOne({username:username});
    if(!user)
    {
      try {
        const userDoc=await User.create({
          username:username,
          password:password,
        });
        res.json(userDoc);
      } 
      catch (error) {
        res.status(400).json(error);
      }
    }
    else{
      res.json({"message":"User Already exists!"})
    }
});

module.exports = router

