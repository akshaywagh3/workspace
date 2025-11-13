// controllers/authController.js
import mongoose from "mongoose";
import workspaceService from "../services/workspaceService.js";

export const createWorkspace = async (req, res, next) => {
    try{

      const userId = new mongoose.Types.ObjectId(req.user.id); 
        const data = {
          name:req.body.name,
          createdBy:userId,
          members:[{
            user:userId,
            role:'owner'
          }]
        }
        const workspace = await workspaceService.createWorkspace(userId,req.body.name);
        res.status(200).json({message: "Workspace created successfully", success: true, workspace});
    }catch (error){
        next(error);
    }
}

export const getMyWorkspaces = async (req, res, next) => {
    try{
       const userId = new mongoose.Types.ObjectId(req.user.id); 

        const workspaces = await workspaceService.getUserWorkspaces(userId);
        res.status(200).json({success: true, workspaces});
    }catch(error){
        next(error)
    }
}

export const addMember = async (req, res, next) => {
    try{
        
        const { workspaceId, userId} = req.body;
        const result = await workspaceService.addMember(workspaceId,userId);
        res.status(200).json({success: true, result});
    }catch(error){
        next(error)
    }
}

export const deleteWorkspace = async (req, res, next) => {
    try{
        const result = await workspaceService.deleteWorkspace(req.params.id,req.user.id);
        res.status(200).json({success: true, ...result});
    }catch(error){
        next(error)
    }
}

export const getInviteLink = async (req, res, next) => {
  try {
    const link = await workspaceService.getInvitelink(req.params.id);
    res.status(200).json({ success: true, link });
  } catch (err) {
    next(err);
  }
};

export const joinByToken = async (req, res, next) => {
  try {
    const workspace = await workspaceService.joinbyInvite(req.user.id, req.params.token);
    res.status(200).json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

