import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

userRouter.get("/", handleHome);

export default globalRouter;
