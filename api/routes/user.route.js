import express from "express";
import { GoogleLogin, login, register } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/google-login", GoogleLogin);

export default userRouter;