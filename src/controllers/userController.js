import { models } from "mongoose";
import User from "../models/User";
import Video from "../models/video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { redirect } from "express/lib/response";

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

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenReq = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenReq) {
    const { access_token } = tokenReq;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary == true && email.verified == true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const user = await User.findOne({
      email: emailObj.email,
    });

    if (!user) {
      const user = await User.create({
        avatarUrl: userData.avatarUrl,
        name: userData.name == null ? userData.login : userData.name,
        username: userData.login,
        password: "",
        socialOnly: true,
        email: emailObj.email,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) =>
  res.render("edit-profile", { pageTitle: "Edit profile" });

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  // const user = await User.findOne({ _id });

  // let errMsg = "";
  // if (user.email == email || user.username == username) {
  //   errMsg = "Your email/username is same!";
  //   return res
  //     .status(400)
  //     .render("edit-profile", { pageTitle: "Edit profile", errMsg });
  // }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  return res.render("change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordCheck },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);

  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errMsg: "The Current Password is incorrect",
    });
  }

  if (newPassword != newPasswordCheck) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errMsg: "The Password does not match the confirmation",
    });
  }

  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("profile", { pageTitle: user.name, user });
};
