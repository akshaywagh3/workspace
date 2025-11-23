import Activity from "../models/Activity.js";

const create = async (data) => {
  return Activity.create(data);
};

const getWorkspaceActivity = async (workspaceId, limit = 50) => {
  return Activity.find({ workspaceId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export default { create, getWorkspaceActivity };
