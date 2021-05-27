import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
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
  const { searchingBy } = req.query.term;
  let videos = [];
  try {
    if (searchingBy === "") return res.redirect(routes.home);
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  return res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

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
    return res.render("videoDetail", { pageTitle: video.title, video });
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
    return res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
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
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// register video View

export const postRegisterView = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      videoId: id,
    });
    req.user.comments.push(newComment.id);
    req.user.save();
    video.comments.push(newComment.id);
    video.save();
    res.json({ newComment });
  } catch (error) {
    res.status(404).end();
  }
};

// Delete Comment

export const deleteComment = async (req, res) => {
  const { videoId, commentId: id } = req.params;
  try {
    const comments = await Comment.findById(id);
    if (comments.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.redirect(`/videos/${videoId}`);
  }
};
