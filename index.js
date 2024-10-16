import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { connectDB } from "./dbConnect.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 4000;

connectDB();
app.listen(PORT, () => console.log("Server is running @port ", PORT));
