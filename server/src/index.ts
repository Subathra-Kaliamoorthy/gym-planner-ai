import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { planRouter } from "./routes/plan";
import { profileRouter } from "./routes/profile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//API routes
app.use("/api/plan", planRouter);
app.use("/api/profile", profileRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});