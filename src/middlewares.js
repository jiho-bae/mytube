import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";
import Video from "./models/Video";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "mytubeee/video",
  }),
  limits: { fileSize: 1e7 },
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "mytubeee/avatar",
  }),
  limits: { fileSize: 3e6 },
});

const uploadVideo = multerVideo.single("videoFile");
export const awsUploadVideo = (req, res, next) => {
  uploadVideo(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      req.flash("error", "10MB 이하 비디오를 등록하세요.");
      console.log("file size error");
      return res.redirect(`${routes.videos}${routes.upload}`);
    } else if (err) {
      console.log(err);
      return res.redirect(`${routes.videos}${routes.upload}`);
    }
    return next();
  });
};

const uploadAvatar = multerAvatar.single("avatar");
export const awsUploadAvatar = (req, res, next) => {
  uploadAvatar(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      req.flash("error", "3MB 이하 이미지를 등록하세요.");
      console.log("file size error");
      return res.redirect(`/users${routes.editProfile}`);
    } else if (err) {
      console.log(err);
      return res.redirect(`/users${routes.editProfile}`);
    }
    return next();
  });
};

export const awsDeleteVideo = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const url = video.fileUrl.split("/");
  const delFileName = url[url.length - 1];
  const params = {
    Bucket: "mytubeee/video",
    Key: delFileName,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log("error : cannot delete aws video object");
      console.log(err, err.stack);
      return res.end();
    }
    console.log("success delete aws video!");
    return next();
  });
};

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "MyTube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (!req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};
