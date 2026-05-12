import express from "express";
import { getUserStats, GoogleLogin, login, logout, register, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/google-login", GoogleLogin);
userRouter.get("/logout", logout);

userRouter.put("/update-user/:id", upload.single('avatar'), updateUser);

userRouter.get("/stats/:id", getUserStats);

export default userRouter;