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
} from "../controllers/userController";
import {onlyPrivate, onlyPublic} from "../middlewares";

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
globalRouter.get(routes.githubCallback, 
  passport.authenticate('github', { failureRedirect: '/login' }), postGithubLogIn);

export default globalRouter;
