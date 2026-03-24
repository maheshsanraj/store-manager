import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import BaseRoutes from "./routes";
import path from "path";
import { Employee } from "./models/employee.model";
import db from "./models";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/v1", BaseRoutes);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src/uploads"))
);
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;