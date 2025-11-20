// repositories/chatRepository.js
import Chat from "../models/ChatRoom.js";

class ChatRepository {
  async findById(id) {
    return Chat.findById(id).populate("members", "firstname lastname email");
  }

  async findDirectChat(user1, user2, workspaceId) {
    return Chat.findOne({
      type: "direct",
      members: { $all: [user1, user2], $size: 2 },
      workspaceId,
    });
  }

  async create(data) {
    return Chat.create(data);
  }

  async getUserChats(userId) {
    return Chat.find({ members: userId })
      .populate("members", "firstname lastname email")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "firstname lastname email" } })
      .sort({ updatedAt: -1 });
  }

  async addMember(chatId, userId) {
    return Chat.findByIdAndUpdate(chatId, { $addToSet: { members: userId } }, { new: true });
  }

  async removeMember(chatId, userId) {
    return Chat.findByIdAndUpdate(chatId, { $pull: { members: userId } }, { new: true });
  }

  async updateLastMessage(chatId, messageId) {
    return Chat.findByIdAndUpdate(chatId, { lastMessage: messageId, lastMessageAt: new Date() }, { new: true });
  }
}

export default ChatRepository;
