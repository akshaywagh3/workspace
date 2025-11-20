import jwt from "jsonwebtoken";
import ChatService from "../services/chatService.js";
import MessageRepository from "../repositories/messageRepository.js";
import ActivityService from "../services/activityService.js";
import WorkspaceService from "../services/workspaceService.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

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
}