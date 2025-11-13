import mongoose from "mongoose";
import Workspace from "../models/Workspace.js";

export default class WorkspaceRepository {
  async create(data) {
    data.createdBy = new mongoose.Types.ObjectId(data.createdBy);
    data.members  =[{
            user: new mongoose.Types.ObjectId(data.createdBy),
    }];

    return await Workspace.create(data);
  }

  async findById(id) {
    return await Workspace.findById(id);
  }

  async findOne(data) {
    return await Workspace.findOne(data);
  }

  async findByUser(userId) {
    return await Workspace.find({$or: [
      { "members.user": userId },
      { createdBy: userId }
    ] }).populate("members.user", "email");
  }

  async save(workspace) {
    return await workspace.save();
  }

  async deleteById(id) {
    return await Workspace.findByIdAndDelete(id);
  }
}
