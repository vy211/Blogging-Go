import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Swal from "sweetalert2";
import { hostLink } from "../host";
export default function LoginPage() {
  //use state hook for setting username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);

  async function login(event) {
    event.preventDefault();

    //sending data to server using post request
    //this is one way of doing we can also use axios instead
    //of fetch
    const response = await fetch(`${hostLink}auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    console.log("res", response);
    //if login is succesfull we need to redirect to home page
    if (response.ok) {
      response.json().then((userinfo) => {
        setUserInfo(userinfo);
        setRedirect(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1000,
        });
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Wrong Credential!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1 className="text-4xl mb-5 logo-font">Login</h1>
      <input
        type="text"
        placeholder="usename"
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="text-xl w-full rounded-lg font-semibold bg-gray-600 border border-white active:bg-gray-800 active:shadow-none neu-shadow-white p-2 text-white mt-5">
        Login
      </button>
    </form>
  );
}