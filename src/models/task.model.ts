import mongoose, { Schema, Types } from "mongoose";

enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in progress",
  DONE = "done",
}
enum TaskLabel {
  WORK = "work",
  PERSONAL = "personal",
  SHOPPING = "shopping",
  OTHER = "other",
}
enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

const taskSchema: Schema = new mongoose.Schema({
  dueDate: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  taskStatus: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
  label: {
    type: String,
    enum: Object.values(TaskLabel),
    default: TaskLabel.PERSONAL,
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  },
  projectId: {
    type: Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

export default mongoose.model("Task", taskSchema);
