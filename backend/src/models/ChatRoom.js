import mongoose from "mongoose";

const chatMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  lastReadMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  lastReadAt: { type: Date, default: null },
}, { _id: false });

const Chatroom = new mongoose.Schema({
    workspaceId: {type:mongoose.Schema.Types.ObjectId, ref: 'Workspace',required:true},
    name: {type:String,default: "general"},
    type: { type: String, enum: ["general", "direct"], default: "general" },
    members: [
            chatMemberSchema,
        ],   
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date }
});
chatSchema.index({ workspaceId: 1 });

export default mongoose.model('Chat',Chatroom)
