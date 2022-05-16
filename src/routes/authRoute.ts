import * as express from "express";
import { setLogin, setLogout } from "../controllers/authController";

const router = express.Router();

router.post("/login", setLogin);
router.post("/logout", setLogout);

export default router;
