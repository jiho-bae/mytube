import passport from "passport";
import GithubStrategy from "passport-github";
import NaverStrategy from "passport-naver";
import KakaoStrategy from "passport-kakao";
import {
  kakaoLoginCallback,
  githubLoginCallback,
  naverLoginCallback,
} from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://wetubeeee1010.herokuapp.com${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NA_ID,
      clientSecret: process.env.NA_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://wetubeeee1010.herokuapp.com${routes.naverCallback}`
        : `http://localhost:4000${routes.naverCallback}`,
    },
    naverLoginCallback
  )
);
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KA_ID,
      clientSecret: process.env.KA_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://wetubeeee1010.herokuapp.com${routes.kakaoCallback}`
        : `http://localhost:4000${routes.kakaoCallback}`,
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
