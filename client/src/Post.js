//using this to match our date format with that of in Database
import { format } from 'date-fns';
import {Link} from 'react-router-dom';


//Passed props to post
export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  likes,
  comments,
}) {
  // console.log(author);
  return (
    <div className="post bg-white p-4 border border-black rounded neu-shadow">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:4000/" + cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <a className="author">{author.username}</a>
          <time>{format(new Date(createdAt), "MMM d,yyyy HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
        <p className="flex">
          <img className="l-2 w-4 mr-2" src="/like.png"></img>
          <p className="md:font-bold">{likes.length}</p>
          <img className="l-2 w-4 ml-6 mr-2" src="/chat.png"></img>
          <p className="md:font-bold">{comments.length}</p>
        </p>
      </div>
    </div>
  );
}