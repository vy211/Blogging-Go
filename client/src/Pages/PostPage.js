import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [Liked,setLiked]=useState(null);
  const [usernames,setUsernames]=useState([]);

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
    try{
      // Make an API request to store the comment for the post
      const response = await fetch(`http://localhost:4000/post/comment/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentText:commentText,
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
      }else{
        console.error("Failed to submit the comment.");
      }
      }catch(err){
      console.log("error is ",err);
    }

   
  };

  //handling the change in comment text
  const handleChange = (event) => {
    setCommentText(event.target.value);
  };

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`http://localhost:4000/post/${id}`);
      if (response.ok) {
        const postData = await response.json();
        setPostInfo(postData);
        setLikes(postData.likes.length);
        // setComments(postData.comments);

         // Sort comments by their timestamps in ascending order
        const sortedComments = postData.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        // Extract comments and usernames from the sorted comments array
        const extractedComments = sortedComments.map(comment => comment.content);
        const extractedUsernames = sortedComments.map(comment => comment.author.username);

        setComments(extractedComments);
        setUsernames(extractedUsernames);
        console.log(extractedComments);
        console.log(extractedUsernames);
         // Check if the current user has liked the post
        const hasLiked = postData.likes.some((like) => like._id === userInfo.id);
        setLiked(hasLiked);
      }
    }
    fetchPostData();
  }, [id]);

  if (!postInfo) return "";

    return (
            <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
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
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=''/>
            </div>
            
            <div  className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>

            <div className="post-interactions">
                <button className={`like-btn ${Liked ? 'liked' : ''}`} onClick={handleLike}>
                    Likes: {likes}
                </button>

            <div className="comments">
                <h3>Comments</h3>
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
                <button type="submit">Submit</button>
                </form>
            </div>
            </div>
        </div>      
    );
};