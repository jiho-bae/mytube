import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  logout,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  githubLogin,
  getMe,
  naverLogin,
  kakaoLogin,
  postSocialLogIn,
} from "../controllers/userController";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

// Join
globalRouter
  .route(routes.join)
  .all(onlyPublic)
  .get(getJoin)
  .post(postJoin, postLogin);

// Login
globalRouter.route(routes.login).all(onlyPublic).get(getLogin).post(postLogin);

// Home
globalRouter.get(routes.home, home);

// Search
globalRouter.get(routes.search, search);

// Logout
globalRouter.get(routes.logout, onlyPrivate, logout);

// Github
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postSocialLogIn
);

globalRouter.get(routes.me, getMe);

// Naver
globalRouter.get(routes.naver, naverLogin);
globalRouter.get(
  routes.naverCallback,
  passport.authenticate("naver", { failureRedirect: "/login" }),
  postSocialLogIn
);

// kakao

globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  postSocialLogIn
);

export default globalRouter;
