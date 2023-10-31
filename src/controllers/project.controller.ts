import { Request, Response } from "express";

import projectModel from "../models/project.model";

export async function createProject(req: Request, res: Response) {
  try {
    let { title, description, user } = req.body;
    description = description.trim();
    let project = new projectModel({
      title: title,
      description: description,
      user: user,
    });
    const savedProject = await project.save();
    if (savedProject) {
      res.status(201).json({
        message: "Project created successfully",
        data: savedProject,
        status: 201,
      });
    }
  } catch (error: any) {
    console.error(`Error creating project: ${error.message}`);
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    let projectId = req.params.id;
    const deletedProject = await projectModel.findByIdAndDelete(projectId);
    if (deletedProject) {
      res.status(200).json({
        message: "Project deleted successfully",
        data: deletedProject,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error deleting project: ${error.message}`);
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    let projectId = req.params.id;
    const project = await projectModel.find({ _id: projectId });
    if (project) {
      res.status(200).json({
        message: "Project retrieved successfully",
        data: project,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error retrieving project: ${error.message}`);
  }
}

export async function getProjects(req: Request, res: Response) {
  try {
    let user = req.query.user;
    const projects = await projectModel.find({ user: user });
    if (projects) {
      res.status(200).json({
        message: "Projects retrieved successfully",
        data: projects,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error retrieving projects: ${error.message}`);
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    let projectId = req.params.id;
    let { title, description } = req.body;
    description = description.trim();
    let project = await projectModel.findById(projectId);
    if (project) {
      project.title = title;
      project.description = description;
      const updatedProject = await project.save();
      if (updatedProject) {
        res.status(200).json({
          message: "Project updated successfully",
          data: updatedProject,
          status: 200,
        });
      }
    } else {
      res.status(404).json({ messsage: "Project not found", status: 404 });
    }
  } catch (error: any) {
    console.error(`Error updating project: ${error.message}`);
  }
}

module.exports = {
  createProject,
  deleteProject,
  getProject,
  updateProject,
  getProjects,
};
