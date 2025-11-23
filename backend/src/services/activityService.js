import activityRepo from "../repositories/activityRepo.js";


class ActivityService {

    async logActivity (workspaceId, userId, type, metadata = {})  {
      return activityRepo.create({
        workspaceId,
        userId,
        type,
        metadata
      });
    };
    
    async getWorkspaceActivity (workspaceId, limit = 50)  {
      return activityRepo.getWorkspaceActivity(workspaceId, limit);
    };

}

export default ActivityService;
