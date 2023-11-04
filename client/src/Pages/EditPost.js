import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import {useParams, Navigate } from "react-router-dom";
import Editor from "../Editor";

   
  
function EditPost(){
    const [title,setTitle]=useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent]=useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState('');

    const {id}=useParams();
    let response;
    useEffect(() => {
      async function fetchData(){

        response=await fetch(`http://localhost:4000/post/${id}`);
        if(response.ok)
        {
          const postDoc=await response.json();
          setTitle(postDoc.title);
          setSummary(postDoc.summary);
          setContent(postDoc.content);
        }
      }
      fetchData();
    }, []);
  
    async function editPost(ev)
    {
        ev.preventDefault();
        const data=new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        //if we update new image it will be stored else old one will be used
        if (files?.[0]) {
          data.set('file', files?.[0]);
        }

        //let's see what are we sending 
        console.log([...data]); // Log the form data to the console


        const response = await fetch(`http://localhost:4000/post/${id}`, {
          method: 'PUT',
          body: data,
          credentials: 'include',
        });

        if(response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form onSubmit={editPost}>
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
    
          <Editor onChange={setContent} value={content}/>
          <button style={{marginTop:'5px'}}>Edit post</button>
        </form>
    );
};

export default EditPost;