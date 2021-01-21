import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Join

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try{
    const user = await User({
      name,
      email
    });
    await User.register(user, password);
    next();
  } catch(error){
    console.log(error);
    res.redirect(routes.home);
  } 
  }
};

// Login

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

// github
export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
}

// kakao

export const kakaoLogin = passport.authenticate('kakao');

export const kakaoLoginCallback = async (_,__,profile,cb) => {
  const {id, username:name,
    _json: {  
      properties:{ profile_image: avatarUrl }, 
      kakao_account:{ email } 
    }
  } = profile;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
}

export const postKakaoLogIn = (req, res) => {
  res.redirect(routes.home);
}

// Logout

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });  
};

export const userDetail = async (req, res) =>{
  const {params: {id}} = req;
  try{
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "User Detail", user }); 
  } catch(error){
    res.redirect(routes.home);
  }
};
// EditProfile

export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

// ChangePassword

export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
