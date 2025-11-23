import express from "express";
import {
  getOrCreateDirectChat,
  createGroupChat,
  getMyChats,
  getMessages,
  sendMessage,
  addMemberToGroup,
  removeMemberFromGroup,
  markMessageAsRead,getMessagesPaged,
  getWorkspaceChats
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Direct chat
router.post("/direct", protect, getOrCreateDirectChat);

// Group chat
router.post("/group", protect, createGroupChat);

// Fetch chats
router.get("/my", protect, getMyChats);

// Messages
router.get("/:id/messages", protect, getMessages);
router.post("/send", protect, sendMessage);

// Group member manage
router.post("/group/add-member", protect, addMemberToGroup);
router.post("/group/remove-member", protect, removeMemberFromGroup);

// Read receipts
router.post("/read/:id", protect, markMessageAsRead);
router.post("/chats/:chatId/messages", protect, getMessagesPaged);
router.get("/workspaces/:workspaceId/chats", protect, getWorkspaceChats);


export default router;
