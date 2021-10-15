import express from "express";
import { Request, Response } from "express";
import cors from "cors";

import projectRoute from "./routes/project";

const app = express();

app.use(cors());

const { PORT = 3000 } = process.env;

app.use("/project", projectRoute);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "hello world",
  });
});

app.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});
