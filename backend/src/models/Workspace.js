import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Workspace name is required"],trim: true,},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
members: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        role: {type: String, enum: ['owner','collaborator','viewer'],default: 'collaborator'}
    }],
    inviteToken: { type: String, unique: true },
}, { timestamps: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
