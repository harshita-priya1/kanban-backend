import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    // indian time
    default: Date.now() + 5.5 * 60 * 60 * 1000,
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("User", userSchema);
