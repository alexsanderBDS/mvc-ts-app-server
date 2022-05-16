import { Request, Response } from "express";
import { db } from "../db/pg.config";
import { Item } from "../models/itemModel";
import { v4 as uuidv4 } from "uuid";

export async function getAllItens(req: Request, res: Response) {
  try {
    const { rows: itens }: { rows: Item[] } = await db.query(
      "SELECT * FROM sold_itens ORDER BY updatedAt, createdAt ASC"
    );
    res.status(200).json(itens);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function getItemByClientId(req: Request, res: Response) {
  const id: string = req.params.id;

  const { rows: itens }: { rows: Item[] } = await db.query(
    "SELECT * FROM sold_itens WHERE client_id = $1 ORDER BY updatedAt ASC",
    [id]
  );

  if (!itens) {
    return res.status(404).json({ user: "No Item found" });
  }

  res.status(200).json(itens);
}

export async function addItem(req: Request, res: Response) {
  try {
    const data: Item = req.body;
    const datetime = new Date();
    const generatedId: string = uuidv4();

    await db.query(
      "INSERT INTO sold_itens(_id ,item, amount, value, client_id, createdAt) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        generatedId,
        data.item,
        data.amount,
        data.value,
        data.client_id,
        datetime,
      ]
    );

    res.status(201).json({
      "Item Added:": {
        ...data,
        _id: generatedId,
        createdAt: datetime,
      },
    });
  } catch (error) {
    if (error instanceof Error) res.status(406).json({ Error: error.message });
    else res.json(error);
  }
}
