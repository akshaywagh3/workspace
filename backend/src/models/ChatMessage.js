import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  fileType: { type: String },
  size: { type: Number },
}, { _id: false });

const readBySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  readAt: { type: Date, default: Date.now },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },

  // client-generated id for idempotency / optimistic UI
  clientMessageId: { type: String, index: true, sparse: true },

  attachments: [attachmentSchema],

  // soft delete flag
  deleted: { type: Boolean, default: false },

  // read receipts
  readBy: [readBySchema],
}, { timestamps: true });

// Compound index for fetching recent messages per chat fast
messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
