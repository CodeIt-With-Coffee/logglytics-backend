import express, { NextFunction, Response } from "express";
import { formatResponse, valid } from "../utils";
import { COLLECTION } from "../utils/constants";
import { LoggerRequest, PROJECT } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.use((req: LoggerRequest, res: Response, next: NextFunction) => {
  if (req.payload.auth) next();
  else res.json(formatResponse(false, null, "not authenticated"));
});

router.get("/", async (req: LoggerRequest, res: Response) => {
  const result = req.db.collection<PROJECT>(COLLECTION.PROJECTS).find({
    userId: req.payload.data.userId,
  });
  const projects = await result
    .map((p) => ({
      id: p._id.toString(),
      name: p.name,
      platform: p.platform,
    }))
    .toArray();
  return res.json(formatResponse(true, projects));
});

router.get("/:projectId", async (req: LoggerRequest, res: Response) => {
  const { projectId } = req.params;
  const project = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOne({
      _id: projectId,
    });
  if (!project) {
    return res.json(formatResponse(false, null, "invalid project id provided"));
  }
  if (project.userId !== req.payload.data.userId) {
    return res.json(
      formatResponse(false, null, "user has no permission to this project")
    );
  }
  return res.json(
    formatResponse(true, {
      id: project._id,
      name: project.name,
      platform: project.platform,
    })
  );
});

router.post("/", async (req: LoggerRequest, res: Response) => {
  const { name, platform } = req.body;
  if (!valid(name, platform)) {
    return res.json(
      formatResponse(false, null, "invalid arguments. need => name, platform")
    );
  }
  const result = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .insertOne({
      _id: uuidv4(),
      name,
      userId: req.payload.data.userId,
      platform,
    });
  return res.json(formatResponse(true, result.insertedId));
});

router.put("/:projectId", async (req: LoggerRequest, res: Response) => {
  const { name, platform } = req.body;
  const { projectId } = req.params;
  if (!valid(name, projectId, platform)) {
    return res.json(
      formatResponse(
        false,
        null,
        "invalid arguments. need => name, projectId, platform"
      )
    );
  }
  const project = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOne({
      _id: projectId,
    });
  if (!project) {
    return res.json(formatResponse(false, null, "invalid project id provided"));
  }
  if (req.payload.data.userId !== project.userId) {
    return res.json(
      formatResponse(false, null, "user has no permission to this project")
    );
  }
  const result = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $set: {
          name,
          platform,
        },
      }
    );
  return res.json(formatResponse(true, result.value._id));
});

router.delete("/:projectId", async (req: LoggerRequest, res: Response) => {
  const { projectId } = req.params;
  if (!valid(projectId)) {
    return res.json(
      formatResponse(false, null, "invalid arguments. need => projectId")
    );
  }
  const project = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOne({
      _id: projectId,
    });
  if (!project) {
    return res.json(formatResponse(false, null, "invalid project id provided"));
  }
  if (req.payload.data.userId !== project.userId) {
    return res.json(
      formatResponse(false, null, "user has no permission to this project")
    );
  }
  const result = await req.db
    .collection<PROJECT>(COLLECTION.PROJECTS)
    .findOneAndDelete({
      _id: projectId,
    });
  return res.json(formatResponse(true));
});

export default router;
