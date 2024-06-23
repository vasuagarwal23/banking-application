import { Router } from "express";
import { registerCustomer } from "../controllers/user.controller.js";
const router = Router();
router.post("/register", registerCustomer);
export default router;

