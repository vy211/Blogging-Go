import { useState } from "react";

export default function RegisterPage(){
  
  //use state hook of react
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');

  //doing post request with javascript file you can also perform
  //post request using html form or via postman(only for testing purpose).
  async function register(event){
    event.preventDefault();
    const response=await fetch('http://localhost:4000/auth/register',{
      method:'POST',
      mode:'cors',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username,password}),
    });
    console.log(response);
    if(response.status===200){
      alert('registration successful ');
    }
    else{
      alert('registration failed');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text" 
        placeholder="username"
        value={username}
        onChange={event=>setUsername(event.target.value)}
      />
      <input type="password" 
        placeholder="password"
        value={password}
        onChange={event=>setPassword(event.target.value)}  
      />
      <button>Register</button>
    </form>
  );
}; 