const mongoose=require('mongoose');
const {Schema,model}=mongoose;


const CommentSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [CommentSchema],
  likes: [LikeSchema]
}, {
  timestamps: true
});

const PostModel = model('Post', PostSchema);
const CommentModel=model('Comment',CommentSchema);

module.exports = { PostModel, CommentModel };
