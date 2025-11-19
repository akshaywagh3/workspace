import ChatRepository from "../repositories/chatRepository.js";
import MessageRepository from "../repositories/messageRepository.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

class Chatservice{
    constructor() {
        this.ChatRepo = new ChatRepository();
        this.messageRepo = new MessageRepository();
    }

    // Get or create direct chat
    async getOrCreateDirectChat(user1, user2, workspaceId) {
        
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

        return this.chatRepo.getUserChats(userId);

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
    async sendMessage(chatId, senderId, content, type = "text") {

    }

     // Fetch messages
    async getMessages(chatId) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) throw new ErrorHandler("Chat not found", 404);

        return this.messageRepo.getMessages(chatId);
    }

    // Mark message as read
    async markAsRead(messageId, userId) {
        const msg = await this.messageRepo.findById(messageId);
        if (!msg) throw new ErrorHandler("Message not found", 404);

        return this.messageRepo.markAsRead(messageId, userId);
    }

}

export default Chatservice;