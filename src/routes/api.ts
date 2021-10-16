import express, { NextFunction, Response } from "express";
import { formatResponse, valid } from "../utils";
import { COLLECTION } from "../utils/constants";
import { ApiRequest, PROJECT, EVENT, LOG, LEVEL } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.use(async (req: ApiRequest, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.json({
      status: false,
      code: 400,
      message: "Invalid method: " + req.method + "Supported method: POST",
    });
  }
  const { projectId, apiKey } = req.body;
  if (!valid(projectId, apiKey)) {
    return res.json({
      status: false,
      code: 401,
      message: "Invalid params. Need => projectId, apiKey",
    });
  }
  const project = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOne({
      _id: projectId,
    });
  if (!project) {
    return res.json({
      status: false,
      code: 402,
      message: "Invalid project",
    });
  } else if (project.apiKey !== apiKey) {
    return res.json({
      status: false,
      code: 403,
      message: "Invalid apiKey",
    });
  }
  req.projectId = projectId;
  req.apiKey = apiKey;
  next();
});

router.post("/event", async (req: ApiRequest, res: Response) => {
  const { projectId, apiKey } = req;
  const { key = "DEFAULT" } = req.body;
  const result = await req.db.collection<EVENT>(COLLECTION.EVENTS).insertOne({
    _id: uuidv4(),
    created: new Date().getTime(),
    key,
    projectId,
  });
  return res.json({
    status: true,
  });
});

router.post("/log", async (req: ApiRequest, res: Response) => {
  const { projectId, apiKey } = req;
  const { type = LEVEL.INFO, message = "(EMPTY)" } = req.body;
  const result = await req.db.collection<LOG>(COLLECTION.LOGS).insertOne({
    _id: uuidv4(),
    created: new Date().getTime(),
    message,
    type: Object.keys(LEVEL).includes(type) ? type : LEVEL.INFO,
    projectId,
  });
  return res.json({
    status: true,
  });
});

router.use((err: any, req: ApiRequest, res: Response, next: NextFunction) => {
  console.error(err);
  return res.json({
    status: false,
    error: 500,
    message: "Our mistake",
  });
});

export default router;