import ChatService from "../services/chatService.js";
import mongoose from "mongoose";

const chatService = new ChatService();

export const getOrCreateDirectChat = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const otherUserId = new mongoose.Types.ObjectId(req.body.userId);
    const workspaceId = new mongoose.Types.ObjectId(req.body.workspaceId);

    const chat = await chatService.getOrCreateDirectChat(
      userId,
      otherUserId,
      workspaceId
    );

    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

export const createGroupChat = async (req, res, next) => {
  try {
    const { name, members, workspaceId } = req.body;

    const chat = await chatService.createGroupChat(
      name,
      members.map((m) => new mongoose.Types.ObjectId(m)),
      new mongoose.Types.ObjectId(workspaceId)
    );

    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

export const getMyChats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const chats = await chatService.getUserChats(userId);

    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.body.chatId);
    const senderId = new mongoose.Types.ObjectId(req.user.id);
    const { content, type } = req.body;

    const message = await chatService.sendMessage(
      chatId,
      senderId,
      content,
      type
    );

    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.id);
    const messages = await chatService.getMessages(chatId);

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const addMemberToGroup = async (req, res, next) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.body.chatId);
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    const result = await chatService.addMember(chatId, userId);

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

export const removeMemberFromGroup = async (req, res, next) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.body.chatId);
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    const result = await chatService.removeMember(chatId, userId);

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = async (req, res, next) => {
  try {
    const messageId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const msg = await chatService.markAsRead(messageId, userId);

    res.status(200).json({ success: true, msg });
  } catch (error) {
    next(error);
  }
};

export const getMessagesPaged = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { beforeId, limit = 50 } = req.query;
    const userId = req.user.id; 

    const messages = await chatService.getMessagesPaged(
      chatId,
      beforeId,
      parseInt(limit),
      userId
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    next(err);
  }
};
