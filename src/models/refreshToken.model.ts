import mongoose, { Schema, Types } from "mongoose";

const refreshTokenSchema: Schema = new mongoose.Schema({
  token: {
    type: String,
    // required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    // required: true,
  },
  expiresAt: {
    type: Date,
    // required: true,
  },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
