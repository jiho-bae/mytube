import express from "express";
import routes from "../routes";
import {
  userDetail,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { onlyPrivate, awsUploadAvatar } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route(routes.editProfile)
  .all(onlyPrivate)
  .get(getEditProfile)
  .post(awsUploadAvatar, postEditProfile);

userRouter
  .route(routes.changePassword)
  .all(onlyPrivate)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
