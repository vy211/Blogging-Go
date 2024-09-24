import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { hostLink } from "../host";
export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [Liked, setLiked] = useState(null);
  const [usernames, setUsernames] = useState([]);

  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  const handleLike = async () => {
    const response = await fetch(`http://localhost:4000/post/like/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userInfo.username,
        id: userInfo.id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Response was ok => ", data);
      if (!data.hasLiked) {
        setLiked(false);
        setLikes((prevLikes) => prevLikes - 1);
        console.log("Unliked the post!");
      } else {
        console.log("Liked the post!");
        setLiked(true);
        setLikes((prevLikes) => prevLikes + 1);
      }
    } else {
      console.error("Failed to update likes for the post.");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      // Make an API request to store the comment for the post
      const response = await fetch(`${hostLink}post/comment/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentText: commentText,
          username: userInfo.username,
          id: userInfo.id,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();

        setComments((prevComments) => [newComment, ...prevComments]); // Add the new comment at the beginning
        setUsernames((prevUsernames) => [userInfo.username, ...prevUsernames]); // Add the current user's username at the beginning

        setCommentText(""); // Clear the comment text
        console.log("Comment submitted!");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "You are not Login!",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (err) {
      console.log("error is ", err);
    }
  };

  //handling the change in comment text
  const handleChange = (event) => {
    setCommentText(event.target.value);
  };

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`${hostLink}post/${id}`);
      if (response.ok) {
        const postData = await response.json();
        setPostInfo(postData);
        setLikes(postData.likes.length);
        // setComments(postData.comments);

        // Sort comments by their timestamps in ascending order
        const sortedComments = postData.comments.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        // Extract comments and usernames from the sorted comments array
        const extractedComments = sortedComments.map(
          (comment) => comment.content
        );
        const extractedUsernames = sortedComments.map(
          (comment) => comment.author.username
        );

        setComments(extractedComments);
        setUsernames(extractedUsernames);
        // Check if the current user has liked the post
        const hasLiked = postData.likes.some(
          (like) => like._id === userInfo.id
        );
        setLiked(hasLiked);
      }
    }
    fetchPostData();
  }, [id]);

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <h1 className="text-5xl font-bold">{postInfo.title}</h1>
      <time className="text-2xl font-bold text-red-950">
        {formatISO9075(new Date(postInfo.createdAt))}
      </time>
      <div className="author">by {postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit
          </Link>
          <Link className="delete-btn" to={`/delete/${postInfo._id}`}>
            Delete
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`${hostLink + postInfo.cover}`} alt="" />
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />

      <div className="post-interactions">
        <button
          className={`like-btn ${Liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <div className="flex">
            <img alt="likeimage" className="l-2 w-4 mr-2" src="/like.png"></img>
            <p className="text-bold">: {likes}</p>
          </div>
        </button>

        <div className="comments">
          <h2 className="flex">
            <p>Comments</p>
            <img alt="comment" className="l-2 w-4 ml-2" src="/chat.png"></img>
          </h2>
          {/* Render the list of comments */}
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              {/* Display comment information */}
              <div className="comment-author">{usernames[index]}</div>
              <div className="comment-content">{comment}</div>
            </div>
          ))}

          {/* Comment form */}
          <form onSubmit={handleComment}>
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={handleChange}
            />
            <button
              className="text-xl  rounded-lg font-semibold bg-gray-600 border border-white active:bg-gray-800 active:shadow-none neu-shadow-white p-2 text-white mt-5"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};