import express from "express";
import { registerController, loginController } from "../controller/authController.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);




export default router;
