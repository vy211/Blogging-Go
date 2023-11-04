const express = require('express')
const router = express.Router()
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const multer=require('multer');
const cookieParser=require('cookie-parser');
const uploadMiddleware=multer({dest:'./uploads/'});
const fs=require('fs');//fileSystem module of node
const jwt=require('jsonwebtoken');
// const Post=require('../Models/Post.js')
const path = require('path');
// const Comment=require('../Models/Post.js');
const { PostModel, CommentModel } = require('../Models/Post.js');

app.use(cookieParser());//use this otherwise your cookies would be undefined

// define the home page route
router.get('/',async (req, res) => {
    const posts=await PostModel.find()
    .populate('author',['username']
    ).sort({createdAt:-1})
    .limit(20);
  // console.log(posts.length);
  res.json(posts);
});



//Handling POST request at route '/post'

router.post('/',uploadMiddleware.single('file'),async (req,res)=>{
    console.log(req.file);
    console.log("Request Body")
    console.log(req.body);
    const {originalname,path}=req.file;
    // console.log(originalname," ",path);

    const parts=originalname.split('.');
    const ext=parts[parts.length -1];

    const newPath=path+'.'+ext;
    // console.log(newPath);

    fs.renameSync(path,newPath);
  
  
    //grabbing the token from cookies
    const {token}=req.cookies;
    //verifying the token
    jwt.verify(token,process.env.JWT_SECRET,{},async (err,info)=>{
      if(err) throw err;
      const {title,summary,content}=req.body;
      const postDoc=await PostModel.create({
  
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
});



router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username'
      }
    }).populate('author', 'username');
    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
});


//Deleting the particular post
router.delete('/:id',async (req,res)=>{
//     console.log('we are going to delete this post!!')
    const {id}=req.params;
    // console.log(id);
    try{
      const postDoc=await PostModel.findOneAndDelete({_id:id});
      // console.log(`Post with ${id}  Deleted`);
      res.json({"Message":"Post deleted"});
    }catch(err)
    {
      res.json({"message":err});
    }

});
  
//for updating the particular post
router.put('/:id',uploadMiddleware.single('file'),async (req, res) => {
    const id = req.params.id;
    console.log(req.file);
    console.log("Request body ");
    console.log(req.body);
    // Access the updated post data from req.body
    const { title, summary, content} = req.body;
    if(req.file === undefined)
    {
      //simply update other things as image hasn't been updated
      await PostModel.updateOne({_id:id},{
        title:title,
        content:content,
        summary:summary,
        updatedAt:(new Date()).toISOString()
      });
      console.log('post updated');
    }
    else{
      const {originalname,path}=req.file;
      const parts=originalname.split('.');
      const ext=parts[parts.length -1];
      const newPath=path+'.'+ext;
      fs.renameSync(path,newPath);
      await PostModel.updateOne({_id:id},{
        title:title,
        content:content,
        conver:newPath,
        summary:summary,
        updatedAt:(new Date()).toISOString()
      });
      console.log("post updated");
    }
    // Return a response indicating the success or failure of the update operation
    res.sendStatus(200); // or any other appropriate response code
  });
  
  //handling likes 
  router.post('/like/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const { username, id: userId } = req.body;
  
      // Find the post by its ID
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      } 
      console.log("post is found");
      // Check if the user ID exists in the likes array
      const isLiked = post.likes.some((like) => like._id.toString() === userId.toString());
      console.log("Checking whether this user has liked the post or not!")
      if (isLiked) {
        // User has already liked the post
        // Decrease the like count or handle accordingly
         // Remove the user ID from the likes array
        post.likes = post.likes.filter((like) => like._id.toString() !== userId.toString());
        await post.save();
        console.log("User is unliking the post");
        return res.status(200).json({ hasLiked: false });
      }
      else
      {
        // User is liking the post for the first time
        // Add the user ID to the likes array
        console.log("user is liking the post for the first time!!")
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({ hasLiked:true });
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// handling comments
router.post('/comment/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { username, id: userId, commentText} = req.body;
    console.log(username, userId, commentText);

    const {token}=req.cookies;
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log('Token verification failed');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Token is valid, proceed with adding the comment
      const newComment = new CommentModel({
        content: commentText,
        author: userId
      });

      const post = await PostModel.findById(postId);
      post.comments.push(newComment);
      await post.save();
      console.log('Comment saved successfully!');
      res.json({ message: 'Comment added successfully' });
    });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});
  
module.exports = router
