import express from "express";
import { watch, edit, upload, remove } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", remove);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", remove);

export default videoRouter;
