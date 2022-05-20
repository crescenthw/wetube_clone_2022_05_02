import { models } from "mongoose";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, password, passwordCheck, email, location } = req.body;
  const pageTitle = "Join";
  const dbExists = await User.exists({ $or: [{ username }, { email }] });

  if (password != passwordCheck) {
    return res.status(400).render("join", {
      pageTitle,
      errorMsg: "Password confirmation does not match.",
    });
  }

  if (dbExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMsg: "This username/email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      username,
      password,
      email,
      location,
    });

    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMsg: error._message,
    });
  }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMsg: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMsg: "Wrond password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const logout = (req, res) => res.send("Logout User");
export const see = (req, res) => res.send("See User");
