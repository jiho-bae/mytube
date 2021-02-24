import express from "express";
import routes from "../routes";
import {
  videoDetail,
  deleteVideo,
  postUpload,
  getUpload,
  postEditVideo,
  getEditVideo,
  deleteComment,
} from "../controllers/videoController";
import { onlyPrivate, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

// Upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

// VideoDetail
videoRouter.get(routes.videoDetail(), videoDetail);

// EditVideo
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

// DeleteVideo
videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

// DeleteComment
videoRouter.get(routes.deleteComment(), onlyPrivate, deleteComment);

export default videoRouter;
