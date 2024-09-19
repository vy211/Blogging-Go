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
      <div className="flex items-center gap-2">
        <img src="/bglogo.png" alt="BG Logo" className="w-[50px] rounded-lg" />
        <Link to="/" className="text-4xl logo-font">
          Bloging Go
        </Link>
      </div>
      <nav>
        {username ? (
          <>
            <Link
              to="/create"
              className="text-xl font-semibold bg-white border border-black neu-shadow p-2"
            >
              Create new post
            </Link>
            <span
              className="cursor-pointer text-xl font-semibold bg-white border border-black neu-shadow p-2"
              tabIndex={0}
              onClick={logout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-xl font-semibold bg-white border border-black neu-shadow p-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-xl font-semibold bg-white border border-black neu-shadow p-2"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
