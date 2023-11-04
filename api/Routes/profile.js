const express = require('express')
const app=express();
const router = express.Router()
const cors=require('cors');
const cookieParser=require('cookie-parser');
app.use(express.json());

//when passing credentials we need set up additional properties
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json());
app.use(cookieParser());
const jwt=require('jsonwebtoken');


router.get('/',async (req,res)=>{

    //client is doing get request in order to display our profile
    //Client is sending jwt along with request.
    //Server will verify whether it is same client whom this token was 
    //provided or token has been altererd.
  
    //grabbing the token from cookies
    const {token}=req.cookies;
    //verifying the token
    // console.log("Token Received at profile route is ",token);
    jwt.verify(token,process.env.JWT_SECRET,{},(err,info)=>{
      if(err){
        res.status(401).json({ error: "Invalid or expired token" });
      }
      else{
        console.log("Token is verified");
        res.json(info);
      }
    });
    // res.json(req.cookies);//for reading cookies we need a cookie parser
  });
 

  module.exports = router