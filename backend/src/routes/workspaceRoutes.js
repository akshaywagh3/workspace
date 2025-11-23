import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createWorkspace,
  getMyWorkspaces,
  addMember,
  deleteWorkspace,
  getInviteLink,
  joinByToken,
  getWorkspaceById
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/workspace/create", protect, createWorkspace);
router.get("/workspace/my", protect, getMyWorkspaces);
router.post("/workspace/add-member", protect, addMember);
router.delete("/workspace/:id", protect, deleteWorkspace);
router.get("/workspace/invite/:id", protect, getInviteLink);
router.get("/workspace/:workspaceId", protect, getWorkspaceById);

router.get("/workspace/join/:token", protect, joinByToken);

export default router;
