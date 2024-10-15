import express from "express";
import {
  login,
  logout,
  profile,
  register,
  updateProfile,
} from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.route("/profile").get(profile).put(updateProfile);
authRouter.post("/logout", logout);

export default authRouter;
