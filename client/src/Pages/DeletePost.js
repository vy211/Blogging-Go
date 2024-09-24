import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { hostLink } from "../host";
const DeletePost = () => {
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const deletePost = async () => {
      console.log("Going to delete the post!! with id ", id);
      const response = await fetch(`${hostLink}post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.log("Post Not Deleted");
      }
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }, [id]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Confirm</h1>
    </div>
  );
};

export default DeletePost;
