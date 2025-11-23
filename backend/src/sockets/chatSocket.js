import jwt from "jsonwebtoken";
import ChatService from "../services/chatService.js";
import MessageRepository from "../repositories/messageRepository.js";
import ActivityService from "../services/activityService.js";
import WorkspaceService from "../services/workspaceService.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Chatservice from "../services/chatService.js";

const chatService = new ChatService();
const messageRepo = new MessageRepository();
const activityService = new ActivityService();
const workspaceService = new WorkspaceService();


const setupChatSocket =  (io, { jwtSecret, logger = console }) =>{
    io.on('connection', (socket)=>{
        try{
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;

            if(!token){
                socket.emit("error",{ code: "AUTH_REQUIRED", message: "Token required" });
                return socket.disconnect(true);
            }

            const payload = jwt.verify(token,jwtSecret);

            socket.user = {id:payload.id , email:payload.email, name:payload.name};

            logger.info(`Socket connected Successfully : ${socket.id} user: ${socket.user.id}`)

        }catch(err){
            logger.error(`Socket Auth failed : ${err.message}`);
            socket.emit("error",{ code: "AUTH_REQUIRED", message: "Token required" });
            return socket.disconnect(true);
        }
    });

    const safeEmit = (room,event,data) => {
        try{
            io.to(room).emit(event, data);
        }catch(err){
            logger.error(e);
        }
    }

    //joinworkspace
    socket.on('joinWorkspace', async({workspaceId},ack) => {
        try{
            if(!workspaceId) throw new ErrorHandler("Workspace Id required", 400);

            let isMember1 = await workspaceService.isMember(workspaceId,socket.user.id);

            if(!isMember1) throw new ErrorHandler("Not a member of workspace", 403);

            socket.join(`workspace:${workspaceId}`);

            safeEmit(`workspace:${workspaceId}`,'user:joinedWorkspace',{userid:socket.user.id});

            if (typeof ack == 'function') ack ({success:true});

        }catch(err){
            if (typeof ack == 'function') ack ({success:false, message: err.message});

        }
    });

    //joinChat
    socket.on('JoinChat', async ({chatId},ack) => {
      try{
        const chat = await chatService.getChatById(chatId);
        const isMember = chat.members.map(m => m.toString()).includes(socket.user.id.toString());
        if (!isMember) throw new ErrorHandler("Not a member of this chat", 403);

        socket.join(`chat:${chatId}`);

        safeEmit(`chat:${chatId}`,'user:joinchat',{userId:socket.user.id,chatId})

        if (typeof ack === "function") ack({ success: true });
      } catch (err) {
        if (typeof ack === "function") ack({ success: false, message: err.message });
      }


      //Leavechat
      socket.on('LeaveChat', async({chatId},ack) => {

        try{
            const chat = await chatService.getChatById(chatId);
            const isMember = chat.members.map(m => m.toString()).includes(socket.user.id.toString());
            if (!isMember) throw new ErrorHandler("Not a member of this chat", 403);

            socket.leave(`chat:${chatId}`);

            safeEmit(`chat:${chatId}`,'user:leavechat',{userId:socket.user.id,chatId})

            if (typeof ack === "function") ack({ success: true });
        } catch (err) {
            if (typeof ack === "function") ack({ success: false, message: err.message });
        }

      });

      // sendMessage
      socket.on('SendMessage', async({payload},ack) => {
        
        try{
            const { chatId, content, type = "text", attachments = [], clientMessageId } = payload || {};

            if (!chatId) throw new ErrorHandler("chatId required", 400);
            const chat = await chatService.getChatById(chatId);
            if (!content && (!attachments || attachments.length === 0)) throw new ErrorHandler("Message content required", 400);

            const message = await Chatservice.sendMessage(chatId,socket.user.id,content,type,attachments,clientMessageId)

            safeEmit(`chat:${chatId}`,"message:new",message);
            if (typeof ack === "function") ack({ success: true });
        } catch (err) {
            if (typeof ack === "function") ack({ success: false, message: err.message });
            socket.emit("error", { code: "SEND_FAILED", message: err.message });
        }
      });


      //typing 

      on.on('typing', async({chatID,isTyping}) => {

            if (!chatId) throw new ErrorHandler("chatId required", 400);
            socket.to(`chat:${chatId}`).emit("typing", { chatId, userId: socket.user.id, isTyping });
      });

      // markRead
        socket.on("markRead", async ({ chatId, messageIds }, ack) => {

            try{
                if (!chatId) throw new ErrorHandler("chatId required", 400);

                if (!chatId || !Array.isArray(messageIds)) throw new ErrorHandler("Invalid payload", 400);

                await Promise.all(messageRepo.makAsRead(messageIds,chatId));

                io.to(`chat:${chatId}`).emit("message:read", { chatId, messageIds, userId: socket.user.id });
                if (typeof ack === "function") ack({ success: true });
            } catch (err) {
                if (typeof ack === "function") ack({ success: false, message: err.message });
            }


        });

        // editMessage

        socket.on("editMessage", async ({messageId,content},ack) => {

            try{
                const updatedmsg = await messageRepo.update(messageId,content);
    
                safeEmit(`chat:${updatedmsg.chatId}`, 'message:edited',updatedmsg)

                if (typeof ack === "function") ack({ success: true });

            }catch(error){
                if (typeof ack === "function") ack({ success: false, message: err.message });
            }
        });

        // deleteMessage

        socket.on('deleteMessage', async({messageId},ack) => {
            try {
                const deleted = await chatService.deleteMessage(messageId, socket.user.id);
                io.to(`chat:${deleted.chatId}`).emit("message:deleted", { messageId });
                if (typeof ack === "function") ack({ success: true, messageId });
            } catch (err) {
                if (typeof ack === "function") ack({ success: false, message: err.message });
            }
        })

        //readmessages

        socket.on('read_messages', async({chatId},ack) => {
                if (!chatId) throw new ErrorHandler("chatId required", 400);

                 const isMember = chat.members.map(m => m.toString()).includes(socket.user.id.toString());
                if (!isMember) throw new ErrorHandler("Not a member of this chat", 403);

                const result = await messageRepo.seenAll(chatId,socket.user.id)
                safeEmit(`chat:${chatId}`, 'message:readall',result)


        })

    });
}