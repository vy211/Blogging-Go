import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("http://localhost:4000/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle the error or show an error message to the user
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function logout() {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        credentials: "include",
        method: "POST",
      });

      setUserInfo(null);
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error or show an error message to the user
    }
  }

  if (isLoading) {
    // Show a loading state or spinner while fetching the user profile
    return <div>Loading...</div>;
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
