import { Request, Response } from "express";
import { db } from "../db/pg.config";
import { NewUser, User } from "../models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { StringMessages } from "./validations/errors";

function hashPassword(password: string): string {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const { rows: users }: { rows: User[] } = await db.query(
      "SELECT * FROM clients ORDER BY _id ASC"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function getUser(req: Request, res: Response) {
  const id: string = req.params.id;

  const { rows: users }: { rows: User[] } = await db.query(
    "SELECT * FROM clients WHERE _id = $1",
    [id]
  );

  const user = users.shift();
  if (!user) {
    return res.status(404).json({ user: StringMessages.userNotFound });
  }

  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  try {
    const data: NewUser = req.body;
    const datetime = new Date();
    const generatedId: string = uuidv4();
    const hashedPassword = hashPassword(data.password);

    await db.query(
      "INSERT INTO clients(_id ,email, password, createdAt) VALUES ($1, $2, $3, $4)",
      [generatedId, data.email, hashedPassword, datetime]
    );

    res.status(201).json({
      "User Created:": {
        _id: generatedId,
        email: data.email,
        password: hashedPassword,
        createdAt: datetime,
      },
    });
  } catch (error) {
    if (error instanceof Error) res.status(406).json({ Error: error.message });
    else res.json(error);
  }
}

export async function updateUserPassword(req: Request, res: Response) {
  const data: { email: string; password: string } = req.body;

  let hashedPassword = hashPassword(data.password);

  try {
    const { rowCount }: { rowCount: number } = await db.query(
      "UPDATE clients SET password = $1, updatedAt = $2 WHERE email = $3",
      [hashedPassword, new Date(), data.email]
    );

    if (!rowCount) {
      return res.status(404).json({ Error: StringMessages.userNotFound });
    }

    res
      .status(200)
      .json({ "Updated User": { ...data, password: hashedPassword } });
  } catch (error) {
    if (error instanceof Error) res.status(406).json({ Error: error.message });
    else res.json(error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const { rowCount }: { rowCount: number } = await db.query(
      "DELETE FROM clients WHERE _id = $1",
      [id]
    );

    if (!rowCount) {
      return res.status(404).json({ Error: StringMessages.userNotFound });
    }
    res.status(202).json({ "Deleted User": id });
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ Error: error.message });
    else res.json(error);
  }
}
