import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/family")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

app.listen(5000, () => console.log("Server running on 5000"));