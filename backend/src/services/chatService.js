import ChatRepository from "../repositories/chatRepository.js";
import MessageRepository from "../repositories/messageRepository.js";
import WorkspaceRepository from "../repositories/workspaceRepository.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

class Chatservice{
    constructor() {
        this.ChatRepo = new ChatRepository();
        this.workspaceRepo = new WorkspaceRepository();
        this.messageRepo = new MessageRepository();
    }

    // Get or create direct chat
    async getOrCreateDirectChat(user1, user2, workspaceId) {
        
    }

    async getChatById(chatId) {
        if (!chatId) throw new ErrorHandler("chatId required", 400);
        const chat = await this.ChatRepo.findById(chatId);
        if (!chat) throw new ErrorHandler("Chat not found", 404);
        return chat;
    }

    async createGroupChat(name, members, workspaceId) {
        if(!name)  throw ErrorHandler('Name is required',400);

        if(!members || members.length <2) throw ErrorHandler('Atleast 2 members are required',400);

        return this.ChatRepo.create({
            type:'General',
            name,
            members,
            workspaceId
        });

    }


    async getUserChats(userId) {

        if (!userId) throw new ErrorHandler("User ID is required", 400);

        return this.ChatRepo.getUserChats(userId);

    }

    async addMember(chatId, userId) {

        const ischat = await this.ChatRepo.findById({chatId});
        if(!ischat) throw ErrorHandler('ChatRoom not found',404)


        return this.ChatRepo.addMember({
            chatId,
            userId
        });
    }

    // Remove member
    async removeMember(chatId, userId) {

        const ischat = await this.ChatRepo.findById({chatId});
        if(!ischat) throw ErrorHandler('ChatRoom not found',404)


        return this.ChatRepo.removeMember({
            chatId,
            userId
        });
    }

    // Send message
    async sendMessage(chatId, senderId, content, type = "text", attachments = [], clientMessageId = null) {
        const chat = await this.ChatRepo.findById(chatId);
        if (!chat) throw new ErrorHandler("Chat not found", 404);

        if (!content && (!attachments || attachments.length === 0)) {
            throw new ErrorHandler("Message content or attachments required", 400);
        }
        const chatData = await this.ChatRepo.getChatById(chatId);

            if (chatData.workspaceId && chatData.type == 'general') {
                const workspace = await this.workspaceRepo.findById(chatData.workspaceId);

                const isWorkspaceMember = workspace.members
                    .map((m) => m.user.toString())
                    .includes(senderId.toString());

                    console.log(isWorkspaceMember)
                    console.log(workspace.members)

                if (!isWorkspaceMember) {
                    throw new ErrorHandler(`Not a member of workspace ${workspace.name}`, 403);
                }

            } else {
                // Private chat: check chat.members
                const isMember = chatData.members
                    .map((m) => m.user.toStrin())
                    .includes(senderId.toString());

                if (!isMember) {
                    throw new ErrorHandler("Not a member of chat", 403);
                }
            }

            // idempotency check
            if (clientMessageId) {
                const existing = await this.messageRepo.findByClientId(clientMessageId);
                if (existing) return existing;
            }

        const message = await this.messageRepo.create({
            chatId,
            sender:senderId,
            content,
            type,
            attachments,
            clientMessageId
        });


       await this.updateLastMessage(chatId, message._id)

        return message;
    }


    async markChatAsRead(chatId, userId, lastReadMessageId = null) {
        if (!chatId || !userId) throw new ErrorHandler("chatId and userId required", 400);

        // Ensure chat exists & user is a member
        const chat = await this.ChatRepo.findById(chatId);
        if (!chat) throw new ErrorHandler("Chat not found", 404);

        const isMember = chat.members.map(m => m.user.toString()).includes(userId.toString());
        if (!isMember) throw new ErrorHandler("Not a member of chat", 403);

        // If client didn't supply a lastReadMessageId, use chat.lastMessage
        const cursorMessageId = lastReadMessageId || chat.lastMessage || null;

        // Update chat member cursor
        const updatedChat = await this.ChatRepo.updateMemberReadCursor(chatId, userId, cursorMessageId);

        // Optionally: compute unreadCount or other metadata as needed (offloaded to callers)
        return { chat: updatedChat, lastReadMessageId: cursorMessageId };
    }

     // Fetch messages
    async getMessages(chatId) {
        const chat = await this.ChatRepo.findById(chatId);
        if (!chat) throw new ErrorHandler("Chat not found", 404);

        return this.messageRepo.getMessages(chatId);
    }
    async updateLastMessage(chatId, messageId) {
        return this.ChatRepo.updateLastMessage(chatId, messageId);
    }

    async getMessagesPaged(chatId, opts ={}) {
            const { beforeId, limit, userId } = opts;

            const chat = await this.ChatRepo.findById(chatId);
            if (!chat) throw new ErrorHandler("Chat not found", 404);

            // Optional: check if user is part of chat/workspace
            if (chat.type === "direct") {
            const isMember = chat.members.map(m => m.toString()).includes(userId.toString());
            if (!isMember) throw new ErrorHandler("Not a member of this chat", 403);
            }

            // Query messages
            const query = { chatId };
            if (beforeId) query._id = { $lt: beforeId }; // older messages

            const messages = await this.messageRepo.findbyData(query,limit)

            return messages.reverse();
    }

    // Mark message as read
    async markAsRead(messageId, userId) {
        const msg = await this.messageRepo.findById(messageId);
        if (!msg) throw new ErrorHandler("Message not found", 404);

        return this.messageRepo.markAsRead(messageId, userId);
    }

    async editMessage(messageId, userId, content) {
        const msg = await this.messageRepo.findById(messageId);
        if (!msg) throw new ErrorHandler("Message not found", 404);
        if (msg.sender.toString() !== userId.toString()) throw new ErrorHandler("Not authorized to edit", 403);

        return this.messageRepo.update(messageId, { content, edited: true });
    }

    async deleteMessage(messageId, userId) {
        const msg = await this.messageRepo.findById(messageId);
        if (!msg) throw new ErrorHandler("Message not found", 404);
        if (msg.sender.toString() !== userId.toString()) throw new ErrorHandler("Not authorized to delete", 403);
        return this.messageRepo.softDelete(messageId);
    }

    async getWorkspaceChats(workspaceId) {
        return await ChatRepo.getWorkspaceChats(workspaceId)
        
    }
}

export default Chatservice;