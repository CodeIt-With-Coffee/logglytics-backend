require("dotenv").config();

import express, { NextFunction } from "express";
import { Request, Response } from "express";
import cors from "cors";
import projectRoute from "./routes/project";
import authRoute from "./routes/auth";
import apiRoute from "./routes/api";
import { connectDB, extractJWT, formatResponse } from "./utils";
import { LoggerRequest } from "./utils/types";

const app = express();

app.use(cors());
app.use(express.json());
app.use(connectDB());

const { PORT = 3000 } = process.env;

app.use(extractJWT());
app.use("/project", projectRoute);
app.use("/auth", authRoute);
app.use("/api", apiRoute);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "hello world",
  });
});

app.use((err: any, req: LoggerRequest, res: Response, next: NextFunction) => {
  console.error(err);
  return res
    .status(500)
    .json(formatResponse(false, null, "internal server error"));
});

app.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});
