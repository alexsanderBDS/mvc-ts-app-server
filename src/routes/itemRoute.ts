import * as express from "express";
import {
  addItem,
  getAllItens,
  getItemByClientId,
} from "../controllers/itemController";
import { isLoggedIn } from "../middlewares/auth";

const router = express.Router();

router.get("/", isLoggedIn, getAllItens);
router.get("/item/:id", isLoggedIn, getItemByClientId);
router.post("/item/new", isLoggedIn, addItem);

export default router;
