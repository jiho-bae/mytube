import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  avatarUrl: String,
  name: String,
  videoId: String,
});

const model = mongoose.model("Comment", CommentSchema);
export default model;
