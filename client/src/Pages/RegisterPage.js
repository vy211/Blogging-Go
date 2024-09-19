import { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function register(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);
    if (response.status === 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registration successful!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        setRedirect(true);
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Registration Failed!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="register" onSubmit={register}>
      <h1 className="text-4xl mb-5 logo-font">Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="text-xl w-full rounded-lg font-semibold bg-gray-600 border border-white active:bg-gray-800 active:shadow-none neu-shadow-white p-2 text-white mt-5">
        Register
      </button>
    </form>
  );
}
