import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  Credentials: true
}));
app.use(express.json())


// Routes
app.use("/api/auth", userRouter);


mongoose.connect(process.env.MONGODB_CONN, { dbName: "mern-blog" })
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});



app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});