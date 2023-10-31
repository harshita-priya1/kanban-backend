import express, { Router, Request, Response } from "express";

import projectModel from "../models/project.model";

const projectRouter: Router = express.Router();

projectRouter.post("/create", async (req: Request, res: Response) => {
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
});

projectRouter.delete("/delete/:id", async (req: Request, res: Response) => {
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
});
