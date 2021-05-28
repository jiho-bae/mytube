// Global elements
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users

const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// Videos

const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";
const DELETE_COMMENT = "/:id/:cid/delete";

// Github

const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Naver

const NAVER = "/auth/naver";
const NAVER_CALLBACK = "/auth/naver/callback";

// Kakaotalk

const KAKAO = "/auth/kakao";
const KAKAO_CALLBACK = "/auth/kakao/callback";

// API

const API = "/api";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT = "/:id/comment";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => (id ? `/users/${id}` : USER_DETAIL),
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => (id ? `/videos/${id}` : VIDEO_DETAIL),
  editVideo: (id) => (id ? `/videos/${id}/edit` : EDIT_VIDEO),
  deleteVideo: (id) => (id ? `/videos/${id}/delete` : DELETE_VIDEO),
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  me: ME,
  naver: NAVER,
  naverCallback: NAVER_CALLBACK,
  kakao: KAKAO,
  kakaoCallback: KAKAO_CALLBACK,
  api: API,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  deleteComment: (videoId, commentId) => {
    return videoId && commentId
      ? `/videos/${videoId}/${commentId}/delete`
      : DELETE_COMMENT;
  },
};

export default routes;
