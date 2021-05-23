import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Join

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  if (password !== password2) {
    req.flash("error", "비밀번호가 다릅니다.");
    return res.status(400).render("join", { pageTitle: "Join" });
  }
  try {
    const user = await User({
      name,
      email,
    });
    await User.register(user, password);
    next();
  } catch (error) {
    console.log(error);
    return res.redirect(routes.home);
  }
};

// Login

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "환영합니다.",
  failureFlash: "로그인 할 수 없습니다. 이메일 또는 비밀번호를 확인하세요.",
});

// github
export const githubLogin = passport.authenticate("github", {
  successFlash: "환영합니다.",
  failureFlash: "로그인 할 수 없습니다. 이메일 또는 비밀번호를 확인하세요.",
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
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
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postSocialLogIn = (req, res) => {
  res.redirect(routes.home);
};

// naver
export const naverLogin = passport.authenticate("naver", {
  successFlash: "환영합니다.",
  failureFlash: "로그인 할 수 없습니다. 이메일 또는 비밀번호를 확인하세요.",
});

export const naverLoginCallback = async (_, __, profile, cb) => {
  const {
    id,
    displayName: name,
    _json: { profile_image: avatarUrl, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.naverId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      naverId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (e) {
    return cb(e);
  }
};

// kakao

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: "환영합니다.",
  failureFlash: "로그인 할 수 없습니다. 이메일 또는 비밀번호를 확인하세요.",
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    id,
    username: name,
    _json: {
      properties: { profile_image: avatarUrl },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// Logout, UserDetail

export const logout = (req, res) => {
  req.flash("info", "로그아웃 되었습니다.");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).populate("videos");
    return res.render("userDetail", { pageTitle: "My Info", user });
  } catch (error) {
    console.log(error);
    return res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("videos");
    return res.render("userDetail", { pageTitle: "asdfer", user });
  } catch (error) {
    req.flash("error", "사용자가 존재하지 않습니다");
    return res.redirect(routes.home);
  }
};
// EditProfile

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEditProfile = async (req, res) => {
  const { name, email } = req.body;
  const { file } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "프로필 업데이트");
    return res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "프로필을 업데이트 할 수 없습니다.");
    return res.redirect(routes.editProfile);
  }
};

// ChangePassword

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const { oldPassword, newPassword, newPassword1 } = req.body;
  if (newPassword !== newPassword1) {
    req.flash("error", "새 비밀번호가 서로 다릅니다.");
    return res.status(400).redirect(`/users/${routes.changePassword}`);
  }
  try {
    await req.user.changePassword(oldPassword, newPassword);
    return res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "비밀번호 변경에 실패하였습니다.");
    return res.redirect(`/users/${routes.changePassword}`);
  }
};
