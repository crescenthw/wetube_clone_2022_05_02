import express from "express";

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => req.send("Watch Video");

videoRouter.get("watch", handleWatchVideo);

export default videoRouter;
