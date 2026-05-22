import express from "express";
import { getUserStats, GoogleLogin, login, logout, register, updatePassword, updateProfile, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyAdmin} from "../middleware/verifyAdmin.middleware.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/google-login", GoogleLogin);
userRouter.get("/logout", logout);
userRouter.put('/update-password/:userId', verifyToken, updatePassword);

userRouter.put("/update-user/:id", upload.single('avatar'), updateUser);
userRouter.get("/stats/:id", getUserStats);

userRouter.put('/update/:id', verifyAdmin, upload.single('file'), updateProfile);

export default userRouter;