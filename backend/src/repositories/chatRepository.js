// repositories/chatRepository.js
import Chat from "../models/ChatRoom.js";

class ChatRepository {
  async findById(id) {
    return Chat.findById(id).populate("members", "firstname lastname email");
  }

  async getChatById(id) {
    return Chat.findById(id);
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

  async updateMemberReadCursor(chatId, userId, lastReadMessageId) {
    const update = {
      $set: {
        "members.$.lastReadMessageId": lastReadMessageId ? new mongoose.Types.ObjectId(lastReadMessageId) : null,
        "members.$.lastReadAt": new Date()
      }
    };

    const query = { _id: new mongoose.Types.ObjectId(chatId), "members.user": new mongoose.Types.ObjectId(userId) };

    return Chat.findOneAndUpdate(query, update, { new: true });
  }

  async getMemberCursor(chatId, userId) {
    const chat = await Chat.findOne({ _id: chatId, "members.user": userId }, { "members.$": 1 }).lean();
    return chat?.members?.[0] || null;
  }

  async getWorkspaceChats(workspaceId){
    return await Chat.find({ workspaceId })
        .select("_id name type participants lastMessage updatedAt")
        .sort({ updatedAt: -1 });
  }

  async findOne(query) {
    return await Chat.findOne(query);
  }
}

export default ChatRepository;
