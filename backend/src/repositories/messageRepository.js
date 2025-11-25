import Message from "../models/ChatMessage.js";

class MessageRepository {
  async create(data) {
    return Message.create(data);
  }

  async findById(id) {
    return Message.findById(id);
  }

  async findByClientId(clientMessageId) {
    if (!clientMessageId) return null;
    return Message.findOne({ clientMessageId });
  }

  // paginated fetch (cursor by beforeId)
  async getMessagesPaged(chatId, { beforeId = null, limit = 50 } = {}) {
    const query = { chatId, deleted: false };
    if (beforeId) {
      query._id = { $lt: beforeId };
    }
    return Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", "firstname lastname email")
      .lean();
  }

  async getMessages(chatId) {
    return await Message.find({ chatId }).sort({ createdAt: 1 }).lean();
  }

  async findbyData(data, limit){
    return await Message.find(data).sort({ _id: -1 }) // latest first
            .limit(limit || 20)
            .lean();
  }
  async markAsRead(messageId, userId) {
    return Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
      },
      { new: true }
    );
  }

  async seenAll(chatId, userId) {
     result = Message.updateMany(
      {chatId:chatId},
      {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
      },

    );
    return result.modifiedCount > 0;
  }

  async update(messageId, data) {
    return Message.findByIdAndUpdate(messageId, data, { new: true });
  }

  async softDelete(messageId) {
    return Message.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
  }

  async deleteMessage(messageId,userId) {
    const deleted = await Message.findOneAndDelete({_id: messageId, sender: userId});

    if ( !deleted ) {
      return false;
    } else {
      return true;
    }
  }
}

export default MessageRepository;
