import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";

const app = express();

app.use(cors());

const { PORT = 3000 } = process.env;

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "hello world",
  });
});

app.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});
