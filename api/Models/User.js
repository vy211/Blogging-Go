const mongoose=require('mongoose');

const {Schema,model}=mongoose;

//creating the structure for user data in database
const UserSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true,
    min:4,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  }
});
 
const UserModel=model('User',UserSchema);
module.exports=UserModel;