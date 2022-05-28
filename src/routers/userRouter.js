import express from "express";
import {
  remove,
  postEdit,
  logout,
  see,
  getEdit,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { avatarUpload, protectMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/remove", remove);
userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
