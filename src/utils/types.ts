import { Request } from "express";
import { Db, ObjectId } from "mongodb";

type JWTPayload = {
  auth: boolean;
  data: JWTData;
};

type JWTData = {
  userId: string;
};

type USER = {
  _id: string;
  emailId: string;
};

type PROJECT = {
  _id: string;
  name: string;
  userId: string;
};

type EVENT = {
  _id: string;
  key: string;
  created: number;
  projectId: string;
};

type LOG = {
  _id: string;
  type: string;
  message: string;
  created: number;
  projectId: string;
};

type LoggerRequest = { payload: JWTPayload; db: Db } & Request;

export type { LoggerRequest, JWTData, USER, PROJECT, EVENT, LOG };
