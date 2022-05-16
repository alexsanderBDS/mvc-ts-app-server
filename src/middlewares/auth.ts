import { Request, Response, NextFunction } from "express";
import { db } from "../db/pg.config";
import jwt from "jsonwebtoken";
import { QueryResult } from "pg";
import { User } from "../models/userModel";
import { startEnvControllers } from "../env";
import { CookieName } from "../controllers/validations/cookies";
import { StringMessages } from "../controllers/validations/errors";

startEnvControllers();

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string = req.cookies[CookieName.auth_token];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const id = (<{ _id: string }>decoded)._id;

      const users: QueryResult<User> = await db.query(
        "SELECT * FROM clients WHERE _id = $1",
        [id]
      );

      if (!users.rowCount) {
        res.json({ Error: "Email or password don't match." });
      }

      const user = users.rows.shift();

      if (!user) {
        res.json({ Error: "Email or password don't match." });
      }

      next();
      return;
    }

    res.status(400).json({ error: StringMessages.notLoggedIn });
  } catch (error) {
    if (error instanceof Error) {
      const isThereToken: boolean = req.cookies[CookieName.auth_token] !== "";

      if (isThereToken) {
        res.clearCookie(CookieName.auth_token);
      }
      res.status(500).json({ Error: error.message });
    } else res.status(500).json(error);
  }
}
