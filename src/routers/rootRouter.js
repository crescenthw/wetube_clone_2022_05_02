import express from "express";
import {
  getJoin,
  getLogin,
  postLogin,
  postJoin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
