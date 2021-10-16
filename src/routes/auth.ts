import express, { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { formatResponse, gen, valid } from "../utils";
import { COLLECTION } from "../utils/constants";
import { LoggerRequest, USER } from "../utils/types";

const router = express.Router();

router.get("/", async (req: LoggerRequest, res: Response) => {
  if (!req.payload.auth)
    return res.json(formatResponse(false, null, "not authenticated"));
  const user = await req.db.collection<USER>(COLLECTION.USERS).findOne({
    _id: req.payload.data.userId,
  });
  if (!user) {
    return res.json(formatResponse(false, null, "invalid user"));
  }
  return res.json(
    formatResponse(true, {
      emailId: user.emailId,
    })
  );
});

router.post("/", async (req: LoggerRequest, res: Response) => {
  const { userId, emailId } = req.body;
  if (!valid(userId, emailId)) {
    return res.json(
      formatResponse(false, null, "invalid arguments. need => userId, emailId")
    );
  }
  const user = await req.db.collection<USER>(COLLECTION.USERS).findOne({
    _id: userId,
  });
  if (!user) {
    const result = await req.db.collection<USER>(COLLECTION.USERS).insertOne({
      _id: userId,
      emailId,
    });
  } else if (user.emailId !== emailId) {
    return res.json(formatResponse(false, null, "wrong email address"));
  }

  return res.json(
    formatResponse(
      true,
      gen({
        userId,
      })
    )
  );
});

router.use(
  (err: any, req: LoggerRequest, res: Response, next: NextFunction) => {
    console.error(err);
    return res
      .status(500)
      .json(formatResponse(false, null, "internal server error"));
  }
);

export default router;
