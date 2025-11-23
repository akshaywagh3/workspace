import WorkspaceRepository from "../repositories/workspaceRepository.js";
import  ErrorHandler  from "../middleware/errorMiddleware.js";
import crypto from "crypto";
class WorkspaceService {
  constructor() {
    this.workspaceRepo = new WorkspaceRepository();
  }

  async createWorkspace(userId, name) {
    if (!name) throw new ErrorHandler("Workspace name is required", 400);
    const token = crypto.randomBytes(16).toString("hex");
    const workspace = await this.workspaceRepo.create({
      name,
      createdBy: userId,
      members: [{user:userId,role:'owner'}],
      inviteToken: token
    });

    return workspace;
  }

  async getUserWorkspaces(userId) {
    return await this.workspaceRepo.findByUser(userId);
  }

  async getInvitelink(workspaceId){
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new ErrorHandler("Workspace not found", 404);

    const token = workspace.inviteToken;
    return `${process.env.CLIENT_URL}/join/${workspace.inviteToken}`
  }

  async joinbyInvite(userId,token){
    const workspace = await this.Workspace.findOne({ inviteToken: token });
    if (!workspace) throw new ErrorHandler("Workspace not found", 404);

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === userId
    );
    if (!alreadyMember) {
      workspace.members.push({ user: userId, role: "collaborator" });
      await workspace.save();
    }

    return workspace;
  }

  async IsMember(workspaceId,userId){
    const workspace = await this.Workspace.findById(workspaceId );
    if (!workspace) throw new ErrorHandler("Workspace not found", 404);

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === userId
    );
    if (!alreadyMember) {
       throw new ErrorHandler("Member not found", 404);
    }
    return workspace;

  }

  async addMember(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new ErrorHandler("Workspace not found", 404);

    if (!workspace.members.includes(userId)) {
      workspace.members.push(userId);
      await this.workspaceRepo.save(workspace);
    }

    return workspace;
  }

  async deleteWorkspace(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new ErrorHandler("Workspace not found", 404);

    if (workspace.createdBy.toString() !== userId) {
      throw new ErrorHandler("Not authorized to delete this workspace", 403);
    }

    await this.workspaceRepo.deleteById(workspaceId);
    return { message: "Workspace deleted" };
  }
}

export default  new WorkspaceService();