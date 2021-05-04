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
  postGithubLogIn,
  getMe,
  naverLogin,
  postNaverLogIn,
  kakaoLogin,
  postKakaoLogIn,
} from "../controllers/userController";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

// Join
globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

// Login
globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

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
  postGithubLogIn
);

globalRouter.get(routes.me, getMe);

// Naver
globalRouter.get(routes.naver, naverLogin);
globalRouter.get(
  routes.naverCallback,
  passport.authenticate("naver", { failureRedirect: "/login" }),
  postNaverLogIn
);

// kakao

globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  postKakaoLogIn
);

export default globalRouter;
