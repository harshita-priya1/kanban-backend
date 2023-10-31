import express, { Router } from "express";

import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
  getProjects,
} from "../controllers/project.controller";

const projectRouter: Router = express.Router();

projectRouter.post("/create", createProject);

projectRouter.delete("/delete/:id", deleteProject);

projectRouter.get("/getOne/:id", getProject);

projectRouter.get("/getAll", getProjects);

projectRouter.post("/update/:id", updateProject);

export default projectRouter;
