import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

const DeletePost = () => {
  const [redirect, setRedirect] = useState(false);
    const {id}=useParams();
  useEffect(() => {
    const deletePost = async () => {
        console.log('Going to delete the post!! with id ',id);
        const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.log("Post Not Deleted");
      }
    };

    deletePost();
  }, [id]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Post Deleted</h1>
    </div>
  );
};

export default DeletePost;
