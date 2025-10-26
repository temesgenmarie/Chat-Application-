import express from "express";
import { getMessages, sendMessage } from "../controllers/messageControllers";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware, getMessages);

router.post("/", authMiddleware, sendMessage);

export default router;
