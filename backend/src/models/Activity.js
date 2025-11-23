import mongoose, { mongo } from "mongoose";

const ActivitySchema  = mongoose.Schema({
    workspaceId: {type:mongoose.Schema.Types.ObjectId , ref:'workspace',required:true},
    userId : { type: mongoose.Schema.Types.ObjectId, ref:'user', required: true},
    type: {type: String, enum: ["message_sent", "file_uploaded", "member_added"], required:true},
    metadata: {type: Object, default: {}}
}, {timestamps: true}

);

export default mongoose.model('Activity', ActivitySchema);