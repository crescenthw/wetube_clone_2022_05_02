import express from "express";
import {
  postEdit,
  logout,
  userProfile,
  getEdit,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  avatarUpload,
  protectMiddleware,
  publicMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/logout", protectMiddleware, logout);
userRouter.get("/github/start", publicMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id", userProfile);

export default userRouter;
