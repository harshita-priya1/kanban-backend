import { Request, Response } from "express";

import taskModel from "../models/task.model";

export async function createTask(req: Request, res: Response) {
  try {
    let projectId = req.query.projectId;
    let { title, description, taskStatus, label, priority } = req.body;
    let dueDate = req.body.dueDate || Date.now();
    description = description.trim();
    let task = new taskModel({
      title: title,
      description: description,
      dueDate: dueDate,
      projectId: projectId,
      taskStatus: taskStatus,
      label: label,
      priority: priority,
    });
    const savedTask = await task.save();
    if (savedTask) {
      res.status(201).json({
        message: "Task created successfully",
        data: savedTask,
        status: 201,
      });
    }
  } catch (error: any) {
    console.error(`Error creating task: ${error.message}`);
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    let taskId = req.params.id;
    const deletedTask = await taskModel.findByIdAndDelete(taskId);
    if (deletedTask) {
      res.status(200).json({
        message: "Task deleted successfully",
        data: deletedTask,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error deleting task: ${error.message}`);
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    let taskId = req.params.id;
    const task = await taskModel.find({ _id: taskId });
    if (task) {
      res.status(200).json({
        message: "Task retrieved successfully",
        data: task,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error retrieving task: ${error.message}`);
  }
}

export async function getTasks(req: Request, res: Response) {
  try {
    let projectId = req.query.projectId;
    const tasks = await taskModel.find({ projectId: projectId });
    if (tasks) {
      res.status(200).json({
        message: "Tasks retrieved successfully",
        data: tasks,
        status: 200,
      });
    }
  } catch (error: any) {
    console.error(`Error retrieving tasks: ${error.message}`);
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    let taskId = req.params.id;
    let { taskStatus, label, priority } = req.body;
    let task = await taskModel.findById(taskId);
    if (task) {
      task.taskStatus = taskStatus;
      task.label = label;
      task.priority = priority;
      const updatedTask = await task.save();
      if (updatedTask) {
        res.status(200).json({
          message: "Task updated successfully",
          data: updatedTask,
          status: 200,
        });
      }
    } else {
      res.status(404).json({ messsage: "Task not found", status: 404 });
    }
  } catch (error: any) {
    console.error(`Error updating task: ${error.message}`);
  }
}

export async function modifyTask(req: Request, res: Response) {
  try {
    let taskId = req.query.id;
    let { title, description, dueDate } = req.body;
    description = description.trim();
    let task = await taskModel.findById(taskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      const modifiedTask = await task.save();
      if (modifiedTask) {
        res.status(200).json({
          message: "Task modified successfully",
          data: modifiedTask,
          status: 200,
        });
      }
    } else {
      res.status(404).json({ messsage: "Task not found", status: 404 });
    }
  } catch (error: any) {
    console.error(`Error modifying task: ${error.message}`);
  }
}

module.exports = {
  createTask,
  deleteTask,
  getTask,
  updateTask,
  getTasks,
  modifyTask,
};
