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
  platform: string;
  apiKey: string;
};

type EVENT = {
  _id: string;
  key: string;
  created: number;
  projectId: string;
};

type LOG = {
  _id: string;
  type: LEVEL;
  message: string;
  created: number;
  projectId: string;
};

/**
 * https://sematext.com/blog/logging-levels/
 */
enum LEVEL {
  TRACE = "TRACE",
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

type ApiRequest = { db: Db; projectId: string; apiKey: string } & Request;
type LoggerRequest = { payload: JWTPayload } & { db: Db } & Request;

export type { LoggerRequest, ApiRequest, JWTData, USER, PROJECT, EVENT, LOG };
export { LEVEL };
