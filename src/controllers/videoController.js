import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

// Home

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    return res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// Search

export const search = async (req, res) => {
  const { term: searchingBy } = req.query;
  const keyword = searchingBy.trim();
  let videos = [];
  if (keyword === "") return res.redirect(routes.home);
  try {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    });
  } catch (error) {
    console.log(error);
  } finally {
    res.render("search", { pageTitle: "Search", keyword, videos });
  }
};

// Upload

export const getUpload = (req, res) =>
  res.render("videos/upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
    user,
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: user.id,
    avatarUrl: user.avatarUrl,
    name: user.name,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  return res.redirect(routes.videoDetail(newVideo.id));
};

// VideoDetail

export const videoDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    return res.render("videos/videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    return res.redirect(routes.home);
  }
};

// EditVideo

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    return res.render("videos/editVideo", {
      pageTitle: `Edit ${video.title}`,
      video,
    });
  } catch (error) {
    return res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    return res.redirect(routes.videoDetail(id));
  } catch (error) {
    return res.redirect(routes.home);
  }
};

// DeleteVideo

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    console.log(video);
    if (video.comments.length) {
      await Promise.all(
        video.comments.map((comment) => Comment.findByIdAndRemove(comment))
      );
    }
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    await Video.findOneAndRemove({ _id: id });
    req.flash("success", "비디오 삭제 완료.");
  } catch (error) {
    console.log(error);
    req.flash("error", "비디오 삭제 실패.");
  }
  return res.redirect(routes.home);
};

// register video View

export const postRegisterView = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  if (req.user === undefined) return res.end();
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      videoId: id,
    });
    await Video.findByIdAndUpdate(id, { $push: { comments: newComment.id } });
    req.user.comments.push(newComment.id);
    req.user.save();
    res.json({ newComment });
  } catch (error) {
    res.status(404).end();
  }
};

// Delete Comment

export const deleteComment = async (req, res) => {
  const {
    params: { id, cid },
    user,
  } = req;
  try {
    const comments = await Comment.findById(cid);
    if (comments.creator.toString() !== user.id) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: cid });
      await User.findByIdAndUpdate(user.id, { $pull: { comments: cid } });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.redirect(`/videos/${id}`);
  }
};
