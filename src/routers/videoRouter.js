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
import { onlyPrivate, awsUploadVideo, awsDeleteVideo } from "../middlewares";

const videoRouter = express.Router();

// Upload
videoRouter
  .route(routes.upload)
  .all(onlyPrivate)
  .get(getUpload)
  .post(awsUploadVideo, postUpload);

// VideoDetail
videoRouter.get(routes.videoDetail(), videoDetail);

// EditVideo
videoRouter
  .route(routes.editVideo())
  .all(onlyPrivate)
  .get(getEditVideo)
  .post(postEditVideo);

// DeleteVideo
videoRouter.get(routes.deleteVideo(), onlyPrivate, awsDeleteVideo, deleteVideo);

// DeleteComment
videoRouter.get(routes.deleteComment(), onlyPrivate, deleteComment);

export default videoRouter;
