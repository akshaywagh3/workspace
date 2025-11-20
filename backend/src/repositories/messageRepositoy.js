import Message from "../models/Message.js";

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

  async markAsRead(messageId, userId) {
    return Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
      },
      { new: true }
    );
  }

  async update(messageId, data) {
    return Message.findByIdAndUpdate(messageId, data, { new: true });
  }

  async softDelete(messageId) {
    return Message.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
  }
}

export default MessageRepository;
