import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";
import pool from "./db";
import { JWTData, LoggerRequest } from "./types";

const valid = (...args: any[]) => args.every((v) => !!v);

const gen = (data: JWTData): string => jwt.sign(data, JWT_SECRET);

const verify = (token: string): JWTData | null => {
  const data = jwt.verify(token, JWT_SECRET);
  return data as JWTData;
};

const connectDB = () => {
  return async (req: LoggerRequest, res: Response, next: NextFunction) => {
    try {
      const mongo = await pool();
      if (mongo) {
        req.db = mongo;
        next();
      } else {
        res.status(500).json({
          status: false,
          error: "DB connection failed",
        });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({
        status: false,
        error: "DB connection failed",
      });
    }
  };
};

const extractJWT = () => {
  return async (req: LoggerRequest, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader?.split(" ");
      const bearerToken = bearer?.[1];
      if (bearerToken) {
        const data = verify(bearerToken);
        req.payload = {
          auth: !!data,
          data: data,
        };
      } else {
        req.payload = {
          auth: false,
          data: null,
        };
      }
    } else {
      req.payload = {
        auth: false,
        data: null,
      };
    }
    next();
  };
};

const formatResponse = (
  status: boolean,
  data?: any | string | null,
  error?: string | null
) => {
  return {
    status,
    data,
    error,
  };
};

export { extractJWT, connectDB, formatResponse, gen, valid };
