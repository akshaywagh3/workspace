import mongoose from "mongoose";

const Chatmessage = mongoose.Schema({
    roomId: {type:mongoose.Schema.Types.ObjectId, ref: 'Chatroom',required:true},
    sender : {type:mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    messageText: { type:String, required: true },
    attachments: [
        {
        fileUrl: String,
        fileName: String,
        fileType: String
        }
    ],
    seenBy: [{
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        }],

}, { timestamps: true });

export default mongoose.model('ChatMessage',Chatmessage)
