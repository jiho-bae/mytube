import passport from "passport";
import GithubStrategy from "passport-github";
import { githubLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());
passport.use(
    new GithubStrategy({
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:4000${routes.githubCallback}`
    },
    githubLoginCallback
    )
); 
passport.serializeUser(function (user, done) {
    done(null, user);
    });
    
    passport.deserializeUser(function (user, done) {
    done(null, user);
    });