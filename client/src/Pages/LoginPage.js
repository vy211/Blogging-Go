import { useContext, useState } from "react";
import { Navigate, redirect } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){

  //use state hook for setting username and password
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [redirect,setRedirect]=useState(false);

  const {setUserInfo}=useContext(UserContext);

  async function login(event){
    event.preventDefault();

    //sending data to server using post request
    //this is one way of doing we can also use axios instead 
    //of fetch
    console.log("Going to make req to backend...")
    const response=await fetch('http://localhost:4000/auth/login',{
      method:'POST',
      body:JSON.stringify({username,password}),
      headers:{'Content-Type':'application/json'},
      credentials:'include',
    });
    
    //if login is succesfull we need to redirect to home page
    if(response.ok){
      response.json().then(userinfo=>{
        setUserInfo(userinfo);
        setRedirect(true);
      });
    }
    else{
      alert('wrong credentials');
    }
  };

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return(
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="usename"
             onChange={event => setUsername(event.target.value)}
             />
      <input type="password"
             placeholder="password"
             onChange={event => setPassword(event.target.value)}
             />
      <button>Login</button>
    </form>
  );
}