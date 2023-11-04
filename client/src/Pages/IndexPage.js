import { useState,useEffect } from "react";
import Post from "../Post";

export default function IndexPage(){
  const [posts,setPosts]=useState([]);
  //study about useEffect
  useEffect(()=>{

    //fetching posts from database
    fetch('http://localhost:4000/post').then((response)=>{
      response.json().then(posts=>{
        setPosts(posts);
        console.log(posts.length)
      });
    });
  },[]);

  return (
    <div>
      {posts.length>=2 && posts.map(post=>(
        //displaying post from database
        <Post {...post}/>
      ))}
    </div>
  );
}