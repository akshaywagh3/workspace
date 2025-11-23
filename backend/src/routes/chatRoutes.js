import express from "express";
import {
  getOrCreateDirectChat,
  createGroupChat,
  getMyChats,
  getMessages,
  sendMessage,
  addMemberToGroup,
  removeMemberFromGroup,
  markMessageAsRead,getMessagesPaged
} from "../controllers/chatController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Direct chat
router.post("/direct", isAuthenticated, getOrCreateDirectChat);

// Group chat
router.post("/group", isAuthenticated, createGroupChat);

// Fetch chats
router.get("/my", isAuthenticated, getMyChats);

// Messages
router.get("/:id/messages", isAuthenticated, getMessages);
router.post("/send", isAuthenticated, sendMessage);

// Group member manage
router.post("/group/add-member", isAuthenticated, addMemberToGroup);
router.post("/group/remove-member", isAuthenticated, removeMemberFromGroup);

// Read receipts
router.post("/read/:id", isAuthenticated, markMessageAsRead);
router.post("/chats/:chatId/messages", isAuthenticated, getMessagesPaged);

export default router;
