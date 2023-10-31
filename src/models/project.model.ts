import mongoose, { Schema, Types } from "mongoose";

const projectSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Project", projectSchema);
