import * as express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUserPassword,
} from "../controllers/userController";
import { isLoggedIn } from "../middlewares/auth";

const router = express.Router();

router.get("/", isLoggedIn, getAllUsers);
router.get("/user/:id", isLoggedIn, getUser);
router.post("/user/create", isLoggedIn, createUser);
router.patch("/user/update", isLoggedIn, updateUserPassword);
router.delete("/user/delete/:id", isLoggedIn, deleteUser);

export default router;
