import express, { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
  getTasks,
  modifyTask,
} from "../controllers/task.controller";

const taskRouter: Router = express.Router();

taskRouter.post("/create", createTask);

taskRouter.delete("/delete/:id", deleteTask);

taskRouter.get("/getOne/:id", getTask);

taskRouter.get("/getAll", getTasks);

taskRouter.post("/update/:id", updateTask);

taskRouter.post("/modify", modifyTask);

export default taskRouter;
