const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { PostModel, CommentModel } = require("../Models/Post.js");

const uploadMiddleware = multer({ dest: "./uploads/" });

// Get all posts
const getAllPosts = async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

// Create a new post
const createPost = [
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await PostModel.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  },
];

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username",
        },
      })
      .populate("author", "username");
    res.json(postDoc);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const possibleExtensions = ["png", "jpg", "jpeg", "gif"];
  try {
    await PostModel.findOneAndDelete({ _id: id });

    let imageDeleted = false;

    // Check for each possible extension
    for (const ext of possibleExtensions) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        `acbf5eff113e4f77e4635579a23ded3f.jpg`
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        imageDeleted = true;
        break;
      }
    }
    //66ed20cee5fd4c678188598b
    if (imageDeleted) {
      console.log({ message: "Post and image deleted" });
    } else {
      console.log({ message: "Post deleted, but image not found" });
    }
  } catch (err) {
    res.json({ message: err });
  }
};

// Update a post by ID
const updatePostById = [
  uploadMiddleware.single("file"),
  async (req, res) => {
    const id = req.params.id;
    const { title, summary, content } = req.body;
    if (req.file === undefined) {
      await PostModel.updateOne(
        { _id: id },
        {
          title,
          content,
          summary,
          updatedAt: new Date().toISOString(),
        }
      );
    } else {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      await PostModel.updateOne(
        { _id: id },
        {
          title,
          content,
          cover: newPath,
          summary,
          updatedAt: new Date().toISOString(),
        }
      );
    }
    res.sendStatus(200);
  },
];

// Handle likes

const handleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const { id: userId } = req.body;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.some(
      (like) => like._id.toString() === userId.toString()
    );
    if (isLiked) {
      post.likes = post.likes.filter(
        (like) => like._id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({ hasLiked: false });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ hasLiked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Handle comments
const handleComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { id: userId, commentText } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newComment = new CommentModel({
        content: commentText,
        author: userId,
      });

      const post = await PostModel.findById(postId);
      post.comments.push(newComment);
      await post.save();
      res.json({ message: "Comment added successfully" });
    });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  deletePostById,
  updatePostById,
  handleLike,
  handleComment,
};
