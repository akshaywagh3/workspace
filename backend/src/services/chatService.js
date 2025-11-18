import ChatRepository from "../repositories/chatRepository.js";
import MessageRepository from "../repositories/messageRepository.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

class Chatservice{
    constructor() {
        this.workspaceRepo = new WorkspaceRepository();
        this.messageRepo = new MessageRepository();
    }

    // Get or create direct chat
    async getOrCreateDirectChat(user1, user2, workspaceId) {
        
    }

    async createGroupChat(name, members, workspaceId) {

    }


    async getUserChats(userId) {

    }

    async addMember(chatId, userId) {

    }

    // Remove member
    async removeMember(chatId, userId) {

    }

    // Send message
    async sendMessage(chatId, senderId, content, type = "text") {

    }

     // Fetch messages
    async getMessages(chatId) {

    }

    // Mark message as read
    async markAsRead(messageId, userId) {

    }

}