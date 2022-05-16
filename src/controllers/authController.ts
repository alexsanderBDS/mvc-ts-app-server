import { Request, Response } from "express";
import { QueryResult } from "pg";
import { db } from "../db/pg.config";
import { NewUser, User } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { startEnvControllers } from "../env";
import moment from "moment";
import { StringMessages } from "./validations/errors";
import { CookieName } from "./validations/cookies";

startEnvControllers();

export async function setLogin(req: Request, res: Response) {
  const data: NewUser = req.body;
  const diff = moment.duration(CookieName.miliseconds as number);

  try {
    const userFound: QueryResult<User> = await db.query(
      "SELECT _id, password FROM clients WHERE email = $1",
      [data.email]
    );

    if (!userFound.rowCount) {
      return res.status(404).json({ Error: StringMessages.errorEmailPassword });
    }

    const user = userFound.rows.shift();

    if (!user) {
      return res.status(404).json({ Error: StringMessages.errorEmailPassword });
    }

    const isPassowordCorrect: boolean = bcrypt.compareSync(
      data.password,
      user.password
    );

    if (!isPassowordCorrect) {
      return res.status(404).json({ Error: StringMessages.errorEmailPassword });
    }

    const isThereToken: boolean = !req.cookies[CookieName.auth_token];

    if (!isThereToken) {
      return res.status(404).json({ Error: StringMessages.alreadyLoggedIn });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: `${diff.asDays()}d`,
    });

    res
      .cookie(CookieName.auth_token, token, {
        maxAge: CookieName.miliseconds as number,
        httpOnly: true,
      })
      .status(200)
      .json({ token });
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function setLogout(req: Request, res: Response) {
  const isThereToken: boolean = !req.cookies[CookieName.auth_token];

  if (isThereToken) {
    return res.status(404).json({ status: StringMessages.notLoggedIn });
  }
  res.clearCookie(CookieName.auth_token).status(200).json({
    status: "Success on Logout User.",
  });
}
