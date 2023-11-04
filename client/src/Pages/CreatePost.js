import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
  

const CreatePost =()=>{

  const [title,setTitle]=useState('');
  const [summary,setSummary]=useState('');
  const [content,setContent]=useState('');
  const [files,setFiles]=useState('');
  const [redirect,setRedirect]=useState(false);

  async function createNewPost(ev){
    const data=new FormData();
    data.set('title',title);
    data.set('summary',summary);
    data.set('content',content);
    data.set('file',files[0]);
    ev.preventDefault();
    console.log(files);

    const response=await fetch('http://localhost:4000/post',{
      method:'POST',
      body:data,
      //sending credentials back to server
      //By setting credentials to include we are allowing our fetch api to send our 
      //credentials like cookies ,basic http auth etc back to the server (Read about cors to understand this more clearly)
      //This is nice aritcle about cors
      //(https://javascript.plainenglish.io/understanding-the-basics-to-fetch-credentials-863b25968ed5)

      credentials:'include',
    });

    if(response.ok){
      setRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <form onSubmit={createNewPost}>
      <input type="title"
       placeholder={'Title'} 
        value={title} 
      onChange={ev=>setTitle(ev.target.value)} />

      <input type="summary" 
        placeholder={'Summary'}
        value={summary}
        onChange={ev=>setSummary(ev.target.value)}/>

      <input type="file"
        onChange={ev=> setFiles(ev.target.files)}
      /> 

      {/* Now instead of normal text area we will be using 
      a module named react-quill it provides text-editor
      with many functionalities */ }

      <Editor value={content} onChange={setContent}/>
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
};

export default CreatePost;