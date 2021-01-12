import routes from "../routes";

// Join

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    // To Do : Register User
    res.redirect(routes.home);
  }
};

// Login

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  //To do : verify email & password versus DATABASE
  res.redirect(routes.home);
};

// Logout

export const logout = (req, res) => {
  // TO do : Process Log Out
  res.redirect(routes.home);
};

// UserDetail

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });

// EditProfile

export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

// ChangePassword

export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
