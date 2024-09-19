import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./Pages/CreatePost";
import PostPage from "./Pages/PostPage";
import EditPost from "./Pages/EditPost";
import DeletePost from "./Pages/DeletePost";

function App() {
  return (
    //setting routes for the site
    <>
      <span className="text-gray-600 text-xl fixed top-[25px] left-[25px]">
        <a
          href="https://vy211.github.io/Weather-Info/"
          rel="noreferrer"
          target="_blank"
        >
          <img
            src="/weather.png"
            alt="BG Logo"
            className="w-[50px] rounded-lg"
          />
        </a>{" "}
      </span>
      <span className="text-gray-600 text-xl fixed bottom-[25px] left-[25px]">
        With ♥{" "}
        <a
          href="https://github.com/vy211"
          rel="noreferrer"
          target="_blank"
          className="underline"
        >
          Vipin
        </a>{" "}
      </span>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/delete/:id" element={<DeletePost />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
