import mongoose from "mongoose";

const Chatroom = mongoose.Schema({
    workspaceId: {type:mongoose.Schema.Types.ObjectId, ref: 'Workspace',required:true},
    name: {type:String,default: "general"},
    type: { type: String, enum: ["general", "direct"], default: "general" },
    participants: [{
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        }],   
    lastMessageAt: { type: Date }
});

export default mongoose.model('ChatMessage',Chatroom)
