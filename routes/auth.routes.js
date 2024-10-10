import express from "express";
import { login, profile, register } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", profile);

export default authRouter;
