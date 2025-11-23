import activityRepo from "../repositories/activityRepo.js";

const logActivity = async (workspaceId, userId, type, metadata = {}) => {
  return activityRepo.create({
    workspaceId,
    userId,
    type,
    metadata
  });
};

const getWorkspaceActivity = async (workspaceId, limit = 50) => {
  return activityRepo.getWorkspaceActivity(workspaceId, limit);
};

export default {
  logActivity,
  getWorkspaceActivity,
};
