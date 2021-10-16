import express, { NextFunction, Response } from "express";
import { formatResponse, valid } from "../utils";
import { COLLECTION } from "../utils/constants";
import { LoggerRequest, PROJECT, EVENT, LOG } from "../utils/types";

const router = express.Router();

router.use((req: LoggerRequest, res: Response, next: NextFunction) => {
  if (req.payload.auth) next();
  else res.status(400).json(formatResponse(false, null, "not authenticated"));
});

router.get("/:projectId", async (req: LoggerRequest, res: Response) => {
  const { projectId } = req.params;
  const project = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOne({
      _id: projectId,
    });
  if (!project) {
    return res
      .status(400)
      .json(formatResponse(false, null, "invalid project id provided"));
  }
  if (project.userId !== req.payload.data.userId) {
    return res
      .status(400)
      .json(
        formatResponse(false, null, "user has no permission to this project")
      );
  }
  const result = await req.db
    .collection<LOG>(COLLECTION.LOGS)
    .find({
      projectId: project._id,
    })
    .sort({ created: 1 })
    .map((e) => ({
      type: e.type,
      created: e.created,
      id: e._id,
      message: e.message,
    }))
    .toArray();
  return res.json(formatResponse(true, result));
});

export default router;
